'use client';

import { Ticket, TicketStatus, TicketType } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { confirmDialog } from '@/lib/confirmDialog';
import { useState } from 'react';
import { updateTicketStatus, deleteTicket } from '@/app/actions';

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const [searchLink, setSearchLink] = useState('');

  // Filtrar boletos por link
  const filteredTickets = tickets.filter((ticket) =>
    ticket.link.toLowerCase().includes(searchLink.toLowerCase())
  );

  if (tickets.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500 py-8">
            No hay boletos registrados para este concierto.
          </p>
        </CardBody>
      </Card>
    );
  }

  // Agrupar boletos por pares (usando boletos filtrados)
  const pairs: { [key: string]: Ticket[] } = {};
  const singles: Ticket[] = [];

  filteredTickets.forEach((ticket) => {
    if (ticket.type === TicketType.PAR && ticket.pairId) {
      if (!pairs[ticket.pairId]) {
        pairs[ticket.pairId] = [];
      }
      pairs[ticket.pairId].push(ticket);
    } else {
      singles.push(ticket);
    }
  });

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.DISPONIBLE:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case TicketStatus.VENDIDO:
        return 'bg-gray-800 text-white border-gray-700';
      case TicketStatus.PENDIENTE_ENTREGA:
        return 'bg-gray-300 text-gray-900 border-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getZoneColor = (zone: string) => {
    return zone === 'ROJA' ? 'bg-gray-700' : 'bg-gray-500';
  };
  
  const handleUpdateStatus = async (id: string, status: TicketStatus) => {
      const result = await updateTicketStatus(id, status);
      if (result.success) {
          toast.success(`✅ Estado actualizado a ${status.replace('_', ' ')}`);
      } else {
          toast.error('Error al actualizar estado');
      }
  };
  
  const handleDelete = async (id: string, zone: string) => {
       const confirmed = await confirmDialog({
          title: '¿Eliminar este boleto?',
          description: `Zona ${zone}`,
        });
        
        if (confirmed) {
          const result = await deleteTicket(id);
          if (result.success) {
              toast.success('🗑️ Boleto eliminado');
          } else {
              toast.error('Error al eliminar boleto');
          }
        }
  };

  const renderTicket = (ticket: Ticket, isPair: boolean = false) => (
    <div
      key={ticket.id}
      className={`border-2 rounded-lg p-4 ${isPair ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${getZoneColor(ticket.zone)}`} />
          <span className="font-semibold text-gray-800">
            Zona {ticket.zone}
            {ticket.pairPosition && ` - Boleto ${ticket.pairPosition}`}
          </span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(ticket.status as TicketStatus)}`}>
          {ticket.status.replace('_', ' ')}
        </span>
      </div>

      {ticket.link && (
        <div className="mb-3 flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
          <span className="text-xs text-gray-500">🔗</span>
          <a
            href={ticket.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex-1 break-all"
            title={ticket.link}
          >
            {ticket.link}
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(ticket.link);
              toast.success('🔗 Link copiado al portapapeles');
            }}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
            title="Copiar link"
          >
            📋
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {ticket.status !== TicketStatus.DISPONIBLE && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleUpdateStatus(ticket.id, TicketStatus.DISPONIBLE)}
          >
            ← Disponible
          </Button>
        )}
        {ticket.status !== TicketStatus.VENDIDO && (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleUpdateStatus(ticket.id, TicketStatus.VENDIDO)}
          >
            ✓ Vendido
          </Button>
        )}
        {ticket.status !== TicketStatus.PENDIENTE_ENTREGA && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleUpdateStatus(ticket.id, TicketStatus.PENDIENTE_ENTREGA)}
          >
            ⏳ Pendiente
          </Button>
        )}
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(ticket.id, ticket.zone)}
        >
          🗑️
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Campo de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Input
          label="Buscar por Link"
          type="text"
          placeholder="Ingresa el link o parte del link..."
          value={searchLink}
          onChange={(e) => setSearchLink(e.target.value)}
        />
        {searchLink && (
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {filteredTickets.length} de {tickets.length} boletos
          </p>
        )}
      </div>

      {/* Boletos en Par */}
      {Object.keys(pairs).length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Boletos en Par</h3>
          <div className="space-y-4">
            {Object.entries(pairs).map(([pairId, pairTickets]) => (
              <Card key={pairId}>
                <CardBody>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg">👥</span>
                    <h4 className="font-semibold text-gray-700">Par de Boletos</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pairTickets
                      .sort((a, b) => (a.pairPosition || 0) - (b.pairPosition || 0))
                      .map((ticket) => renderTicket(ticket, true))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Boletos Unitarios */}
      {singles.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Boletos Unitarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {singles.map((ticket) => renderTicket(ticket))}
          </div>
        </div>
      )}
    </div>
  );
}
