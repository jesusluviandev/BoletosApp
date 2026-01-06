'use client';

import { useState, useEffect } from 'react';
import { Ticket, TicketZone, TicketType, TicketStatus } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar boletos desde localStorage
  useEffect(() => {
    const loadedTickets = storage.get<Ticket[]>(STORAGE_KEYS.TICKETS) || [];
    setTickets(loadedTickets);
    setLoading(false);
  }, []);

  // Guardar boletos en localStorage cuando cambien
  useEffect(() => {
    if (!loading) {
      storage.set(STORAGE_KEYS.TICKETS, tickets);
    }
  }, [tickets, loading]);

  const addTickets = (
    concertId: string,
    zone: TicketZone,
    type: TicketType,
    link: string
  ) => {
    const newTickets: Ticket[] = [];
    const now = new Date().toISOString();

    if (type === TicketType.PAR) {
      // Crear 1 par (2 boletos vinculados)
      const pairId = crypto.randomUUID();
      
      // Primer boleto del par
      newTickets.push({
        id: crypto.randomUUID(),
        concertId,
        zone,
        type,
        status: TicketStatus.DISPONIBLE,
        link,
        pairId,
        pairPosition: 1,
        createdAt: now,
      });

      // Segundo boleto del par
      newTickets.push({
        id: crypto.randomUUID(),
        concertId,
        zone,
        type,
        status: TicketStatus.DISPONIBLE,
        link,
        pairId,
        pairPosition: 2,
        createdAt: now,
      });
    } else {
      // Crear 1 boleto unitario
      newTickets.push({
        id: crypto.randomUUID(),
        concertId,
        zone,
        type,
        status: TicketStatus.DISPONIBLE,
        link,
        createdAt: now,
      });
    }

    setTickets((prev) => [...prev, ...newTickets]);
    return newTickets;
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  const getTicketsByConcert = (concertId: string) => {
    return tickets.filter((ticket) => ticket.concertId === concertId);
  };

  const getTicketsByAccount = (accountId: string) => {
    // Esta función ya no es necesaria pero la mantenemos por compatibilidad
    return [];
  };

  const getTicketStats = (concertId: string) => {
    const concertTickets = getTicketsByConcert(concertId);
    return {
      total: concertTickets.length,
      disponibles: concertTickets.filter((t) => t.status === TicketStatus.DISPONIBLE).length,
      vendidos: concertTickets.filter((t) => t.status === TicketStatus.VENDIDO).length,
      pendientes: concertTickets.filter((t) => t.status === TicketStatus.PENDIENTE_ENTREGA).length,
    };
  };

  const getGlobalStats = () => {
    const allTickets = tickets;
    return {
      total: allTickets.length,
      disponibles: allTickets.filter((t) => t.status === TicketStatus.DISPONIBLE).length,
      vendidos: allTickets.filter((t) => t.status === TicketStatus.VENDIDO).length,
      pendientes: allTickets.filter((t) => t.status === TicketStatus.PENDIENTE_ENTREGA).length,
      // Desglose por zona
      zonaRoja: allTickets.filter((t) => t.zone === TicketZone.ROJA && t.status === TicketStatus.DISPONIBLE).length,
      zonaAzul: allTickets.filter((t) => t.zone === TicketZone.AZUL && t.status === TicketStatus.DISPONIBLE).length,
      // Desglose por tipo
      unitarios: allTickets.filter((t) => t.type === TicketType.UNITARIO).length,
      pares: allTickets.filter((t) => t.type === TicketType.PAR).length,
    };
  };

  return {
    tickets,
    loading,
    addTickets,
    updateTicketStatus,
    deleteTicket,
    getTicketsByConcert,
    getTicketsByAccount,
    getTicketStats,
    getGlobalStats,
  };
}
