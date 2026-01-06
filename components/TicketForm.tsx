'use client';

import { useState } from 'react';
import { TicketZone, TicketType } from '@/types';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { createTickets } from '@/app/actions';
import toast from 'react-hot-toast';

interface TicketFormProps {
  concertId: string;
}

export function TicketForm({ concertId }: TicketFormProps) {
  const [zone, setZone] = useState<TicketZone>(TicketZone.AZUL);
  const [type, setType] = useState<TicketType>(TicketType.PAR);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (link) {
      setLoading(true);
      const result = await createTickets(concertId, zone, type, link);
      setLoading(false);
      
      if (result.success) {
        const totalTickets = type === TicketType.PAR ? 2 : 1;
        toast.success(`✅ ${totalTickets} boleto(s) creado(s) exitosamente`);
        setLink('');
      } else {
        toast.error(result.error || 'Error al crear boletos');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Agregar Boletos</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Zona"
            value={zone}
            onChange={(e) => setZone(e.target.value as TicketZone)}
            options={[
              { value: TicketZone.ROJA, label: '🔴 Zona Roja' },
              { value: TicketZone.AZUL, label: '🔵 Zona Azul' },
            ]}
            disabled={loading}
          />

          <Select
            label="Tipo de Boleto"
            value={type}
            onChange={(e) => setType(e.target.value as TicketType)}
            options={[
              { value: TicketType.UNITARIO, label: 'Unitario' },
              { value: TicketType.PAR, label: 'Par (2 boletos)' },
            ]}
            disabled={loading}
          />

          <Input
            label="Link del Boleto"
            type="url"
            placeholder="https://ejemplo.com/boleto/123"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            disabled={loading}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            {type === TicketType.PAR ? (
              <p>Se creará <strong>1 par (2 boletos)</strong> vinculados</p>
            ) : (
              <p>Se creará <strong>1 boleto</strong> unitario</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Boletos'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
