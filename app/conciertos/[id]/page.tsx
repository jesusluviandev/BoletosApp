import { use } from 'react';
import { TicketForm } from '@/components/TicketForm';
import { TicketList } from '@/components/TicketList';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';
import { getConcertById, getTicketsByConcert, getTicketStats } from '@/app/actions';

export default async function ConcertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // We can optimize this parallel fetching
  const [concert, tickets, stats] = await Promise.all([
    getConcertById(id),
    getTicketsByConcert(id),
    getTicketStats(id),
  ]);

  if (!concert) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Concierto no encontrado</p>
            <Link href="/conciertos" className="text-primary-600 hover:underline">
              ← Volver a Conciertos
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <Link href="/conciertos" className="text-white/90 hover:text-white mb-4 inline-block">
            ← Volver a Conciertos
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              🎵 {concert.name}
            </h1>
            <p className="text-lg text-white/90">
              📅 {formatDate(concert.date)}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.disponibles}</p>
              <p className="text-sm text-gray-600">Disponibles</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.vendidos}</p>
              <p className="text-sm text-gray-600">Vendidos</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardBody>
          </Card>
        </div>

        {/* Add Tickets Form */}
        <div className="animate-scale-in">
          <TicketForm concertId={id} />
        </div>

        {/* Tickets List */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-800">
                Boletos del Concierto ({tickets.length})
              </h2>
            </CardHeader>
            <CardBody>
              <TicketList tickets={tickets} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
