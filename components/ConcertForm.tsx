'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { createConcert } from '@/app/actions';
import toast from 'react-hot-toast';

export function ConcertForm() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      setLoading(true);
      const result = await createConcert({ name, date });
      setLoading(false);
      
      if (result.success) {
        toast.success('✅ Concierto creado exitosamente');
        setName('');
        setDate('');
      } else {
        toast.error('Error al crear concierto');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Nuevo Concierto</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Concierto"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Coldplay - Music of the Spheres"
            required
            disabled={loading}
          />
          <Input
            label="Fecha del Evento"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Concierto'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
