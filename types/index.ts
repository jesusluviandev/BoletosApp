// Tipos para el sistema de gestión de boletos

export enum LoginMethod {
  GOOGLE = 'GOOGLE',
  PASSWORD = 'PASSWORD',
}

export interface Account {
  id: string;
  email: string;
  password?: string; // Optional - only for PASSWORD login method
  phone: string;
  loginMethod: LoginMethod;
  createdAt: string;
}

export interface Concert {
  id: string;
  name: string;
  date: string;
  createdAt: string;
}

export interface ConcertStats {
  total: number;
  disponibles: number;
  vendidos: number;
  pendientes: number;
  zonaRoja: number;
  zonaAzul: number;
}

export interface ConcertWithStats extends Concert {
  stats: ConcertStats;
}

export enum TicketZone {
  ROJA = 'ROJA',
  AZUL = 'AZUL',
}

export enum TicketType {
  PAR = 'PAR',
  UNITARIO = 'UNITARIO',
}

export enum TicketStatus {
  DISPONIBLE = 'DISPONIBLE',
  VENDIDO = 'VENDIDO',
  PENDIENTE_ENTREGA = 'PENDIENTE_ENTREGA',
}

export interface Ticket {
  id: string;
  concertId: string;
  zone: TicketZone;
  type: TicketType;
  status: TicketStatus;
  link: string; // URL del boleto (obligatorio)
  pairId?: string | null; // ID del par al que pertenece (si es tipo PAR)
  pairPosition?: 1 | 2 | null; // Posición dentro del par (1 o 2)
  createdAt: string;
}

export interface TicketPair {
  pairId: string;
  tickets: [Ticket, Ticket];
}
