'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { TicketZone, TicketType, TicketStatus } from '@/types';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// --- Auth ---

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    let admin = await prisma.admin.findUnique({ where: { email } });

    // Auto-seed: If no admin exists at all, or if this specific email is missing but matches default
    // For safety, let's only auto-seed if the Admin table is COMPLETELY empty to avoid overwrites.
    if (!admin) {
        const count = await prisma.admin.count();
        if (count === 0 && email === 'usuario@boletos.com' && password === 'BoletoApp2026?.') {
            const hashedPassword = await bcrypt.hash(password, 10);
            admin = await prisma.admin.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });
            console.log("Admin auto-seeded.");
        }
    }

    if (!admin) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const passwordsMatch = await bcrypt.compare(password, admin.password);
    if (!passwordsMatch) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    // CREATE SESSION
    const token = await signToken({ id: admin.id, email: admin.email });
    
    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return { success: true };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Ocurrió un error al iniciar sesión' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}

// --- Concerts ---

export async function getConcerts() {
  try {
    const concerts = await prisma.concert.findMany({
      orderBy: { date: 'asc' },
      include: {
        tickets: true // Fetch tickets to calculate stats. For large apps, use aggregation (groupBy) separately.
      }
    });
    
    return concerts.map((c: any) => {
      const tickets = c.tickets;
      return {
        id: c.id,
        name: c.name,
        date: c.date.toISOString().split('T')[0],
        createdAt: c.createdAt.toISOString(),
        stats: {
            total: tickets.length,
            disponibles: tickets.filter((t: any) => t.status === TicketStatus.DISPONIBLE).length,
            vendidos: tickets.filter((t: any) => t.status === TicketStatus.VENDIDO).length,
            pendientes: tickets.filter((t: any) => t.status === TicketStatus.PENDIENTE_ENTREGA).length,
            zonaRoja: tickets.filter((t: any) => t.zone === TicketZone.ROJA && t.status === TicketStatus.DISPONIBLE).length,
            zonaAzul: tickets.filter((t: any) => t.zone === TicketZone.AZUL && t.status === TicketStatus.DISPONIBLE).length,
        }
      };
    });
  } catch (error) {
    console.error('Error fetching concerts:', error);
    return [];
  }
}

export async function createConcert(data: { name: string; date: string }) {
  try {
    const concert = await prisma.concert.create({
      data: {
        name: data.name,
        date: new Date(data.date),
      },
    });
    revalidatePath('/conciertos');
    return { success: true, concert };
  } catch (error) {
    console.error('Error creating concert:', error);
    return { success: false, error: 'Error creating concert' };
  }
}

export async function deleteConcert(id: string) {
  try {
    await prisma.concert.delete({
      where: { id },
    });
    revalidatePath('/conciertos');
    return { success: true };
  } catch (error) {
    console.error('Error deleting concert:', error);
    return { success: false, error: 'Error deleting concert' };
  }
}

export async function getConcertById(id: string) {
  try {
    const concert = await prisma.concert.findUnique({
      where: { id },
    });
    if (!concert) return null;
    return {
      ...concert,
      date: concert.date.toISOString().split('T')[0],
      createdAt: concert.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching concert:', error);
    return null;
  }
}

// --- Tickets ---

export async function getTicketsByConcert(concertId: string) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { concertId },
    });
    return tickets.map((t: any) => ({
      ...t,
      // Mapping database string/enums to Typescript Enums if necessary, 
      // but strings usually match if schema is correct.
      zone: t.zone as TicketZone,
      type: t.type as TicketType,
      status: t.status as TicketStatus,
      createdAt: t.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

export async function createTickets(
  concertId: string,
  zone: TicketZone,
  type: TicketType,
  link: string
) {
  try {
    const now = new Date();
    
    if (type === TicketType.PAR) {
      const pairId = crypto.randomUUID();
      
      // Create two tickets transactionally provided by Prisma normally, 
      // but `createMany` is supported differently in some DBs. 
      // Postgres supports createMany.
      await prisma.ticket.createMany({
        data: [
          {
            concertId,
            zone,
            type,
            status: TicketStatus.DISPONIBLE,
            link,
            pairId,
            pairPosition: 1,
            createdAt: now,
          },
          {
            concertId,
            zone,
            type,
            status: TicketStatus.DISPONIBLE,
            link,
            pairId,
            pairPosition: 2,
            createdAt: now,
          },
        ],
      });
    } else {
      await prisma.ticket.create({
        data: {
          concertId,
          zone,
          type,
          status: TicketStatus.DISPONIBLE,
          link,
          createdAt: now,
        },
      });
    }
    
    revalidatePath(`/conciertos/${concertId}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating tickets:', error);
    return { success: false, error: 'Error creating tickets' };
  }
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  try {
    await prisma.ticket.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/conciertos/[id]'); // We might need the specific path or simply revalidate layout
    return { success: true };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return { success: false, error: 'Error updating ticket' };
  }
}

export async function deleteTicket(id: string) {
  try {
    await prisma.ticket.delete({
      where: { id },
    });
    revalidatePath('/conciertos/[id]');
    return { success: true };
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return { success: false, error: 'Error deleting ticket' };
  }
}

// --- Accounts ---

export async function getAccounts() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return accounts.map((a: any) => ({
      ...a,
      loginMethod: a.loginMethod as any, // Cast to enum or string
      createdAt: a.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
}

export async function createAccount(data: { email: string; phone?: string; loginMethod: string }) {
  try {
    await prisma.account.create({
      data: {
        email: data.email,
        phone: data.phone || null,
        loginMethod: data.loginMethod,
      },
    });
    revalidatePath('/cuentas');
    return { success: true };
  } catch (error) {
    console.error('Error creating account:', error);
    return { success: false, error: 'Error creating account' };
  }
}

export async function updateAccount(id: string, data: { email: string; phone?: string; loginMethod: string }) {
  try {
    await prisma.account.update({
      where: { id },
      data: {
        email: data.email,
        phone: data.phone || null,
        loginMethod: data.loginMethod,
      },
    });
    revalidatePath('/cuentas');
    return { success: true };
  } catch (error) {
    console.error('Error updating account:', error);
    return { success: false, error: 'Error updating account' };
  }
}

export async function deleteAccount(id: string) {
  try {
    await prisma.account.delete({
      where: { id },
    });
    revalidatePath('/cuentas');
    return { success: true };
  } catch (error) {
    console.error('Error deleting account:', error);
    return { success: false, error: 'Error deleting account' };
  }
}

export async function getGlobalStats() {
   try {
    // We can do an aggregate query for performance, but simple logic for now mimics previous one
    // Actually, `groupBy` is better.
    // But let's fetch essential data or count.
    
    const [total, disponibles, vendidos, pendientes, zonaRoja, zonaAzul, unitarios, pares] = await Promise.all([
        prisma.ticket.count(),
        prisma.ticket.count({ where: { status: TicketStatus.DISPONIBLE } }),
        prisma.ticket.count({ where: { status: TicketStatus.VENDIDO } }),
        prisma.ticket.count({ where: { status: TicketStatus.PENDIENTE_ENTREGA } }),
        prisma.ticket.count({ where: { zone: TicketZone.ROJA, status: TicketStatus.DISPONIBLE } }),
        prisma.ticket.count({ where: { zone: TicketZone.AZUL, status: TicketStatus.DISPONIBLE } }),
        prisma.ticket.count({ where: { type: TicketType.UNITARIO } }),
        prisma.ticket.count({ where: { type: TicketType.PAR } }),
    ]);

    return {
      total,
      disponibles,
      vendidos,
      pendientes,
      zonaRoja,
      zonaAzul,
      unitarios,
      pares,
    };
   } catch (error) {
     console.error("Error getting global stats", error);
     return {
         total: 0, disponibles: 0, vendidos: 0, pendientes: 0, zonaRoja: 0, zonaAzul: 0, unitarios: 0, pares: 0
     }
   }
}

export async function getTicketStats(concertId: string) {
    try {
        const [total, disponibles, vendidos, pendientes] = await Promise.all([
            prisma.ticket.count({ where: { concertId } }),
            prisma.ticket.count({ where: { concertId, status: TicketStatus.DISPONIBLE } }),
            prisma.ticket.count({ where: { concertId, status: TicketStatus.VENDIDO } }),
            prisma.ticket.count({ where: { concertId, status: TicketStatus.PENDIENTE_ENTREGA } }),
        ]);
        return { total, disponibles, vendidos, pendientes };
    } catch (error) {
         console.error("Error getting stats", error);
         return { total: 0, disponibles: 0, vendidos: 0, pendientes: 0 };
    }
}
