'use client';

import Link from 'next/link';
import { ConcertWithStats } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { confirmDialog } from '@/lib/confirmDialog';
import { deleteConcert } from '@/app/actions';

interface ConcertListProps {
  concerts: ConcertWithStats[];
}

export function ConcertList({ concerts }: ConcertListProps) {
  if (concerts.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500 py-8">
            No hay conciertos registrados. Crea tu primer concierto arriba.
          </p>
        </CardBody>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirmDialog({
        title: '¿Estás seguro de eliminar este concierto?',
        description: `Se eliminará "${name}" y todos sus boletos`,
    });
    
    if (confirmed) {
        const result = await deleteConcert(id);
        if (result.success) {
            toast.success('🗑️ Concierto eliminado');
        } else {
            toast.error('Error al eliminar concierto');
        }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {concerts.map((concert) => {
        const stats = concert.stats;
        
        return (
          <Card key={concert.id} hover>
            <CardBody className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl">🎵</span>
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                    {concert.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <span>📅</span>
                  <span>{formatDate(concert.date)}</span>
                </p>
              </div>

              {/* Estadísticas del concierto */}
              {stats.total > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-lg text-gray-800">{stats.total}</p>
                      <p className="text-gray-600">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-green-600">{stats.disponibles}</p>
                      <p className="text-gray-600">Disponibles</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-blue-600">{stats.vendidos}</p>
                      <p className="text-gray-600">Vendidos</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-yellow-600">{stats.pendientes}</p>
                      <p className="text-gray-600">Pendientes</p>
                    </div>
                  </div>
                  
                  {/* Desglose por zona */}
                  <div className="pt-2 border-t border-gray-300">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="font-semibold text-gray-700">{stats.zonaRoja}</span>
                        <span className="text-gray-600">Roja</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-semibold text-gray-700">{stats.zonaAzul}</span>
                        <span className="text-gray-600">Azul</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Link href={`/conciertos/${concert.id}`} className="flex-1">
                  <Button className="w-full" size="sm">
                    Ver Boletos
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(concert.id, concert.name)}
                >
                  🗑️
                </Button>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
