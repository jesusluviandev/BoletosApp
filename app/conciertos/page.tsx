import { ConcertForm } from '@/components/ConcertForm';
import { ConcertList } from '@/components/ConcertList';
import { Card, CardBody } from '@/components/ui/Card';
import { getConcerts, getGlobalStats } from '@/app/actions';

export default async function ConciertosPage() {
  const [concerts, globalStats] = await Promise.all([
    getConcerts(),
    getGlobalStats(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            🎵 Gestión de Conciertos
          </h1>
          <p className="text-lg text-white/90">
            Registra y administra los conciertos y sus boletos
          </p>
        </div>

        {/* Estadísticas Globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-gray-800">{globalStats.total}</p>
              <p className="text-sm text-gray-600">Total Boletos</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-green-600">{globalStats.disponibles}</p>
              <p className="text-sm text-gray-600">Disponibles</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-blue-600">{globalStats.vendidos}</p>
              <p className="text-sm text-gray-600">Vendidos</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{globalStats.pendientes}</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardBody>
          </Card>
        </div>

        {/* Desglose por Zona y Tipo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <p className="text-2xl font-bold text-gray-800">{globalStats.zonaRoja}</p>
              </div>
              <p className="text-sm text-gray-600">Zona Roja</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <p className="text-2xl font-bold text-gray-800">{globalStats.zonaAzul}</p>
              </div>
              <p className="text-sm text-gray-600">Zona Azul</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-gray-800">{globalStats.unitarios}</p>
              <p className="text-sm text-gray-600">Unitarios</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-gray-800">{globalStats.pares}</p>
              <p className="text-sm text-gray-600">Pares</p>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ConcertForm />
          </div>

          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <ConcertList concerts={concerts} />
          </div>
        </div>
      </div>
    </div>
  );
}
