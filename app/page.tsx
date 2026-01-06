'use client';

import { useAccounts } from '@/hooks/useAccounts';
import { useConcerts } from '@/hooks/useConcerts';
import { useTickets } from '@/hooks/useTickets';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { accounts } = useAccounts();
  const { concerts } = useConcerts();
  const { tickets } = useTickets();

  const stats = [
    {
      label: 'Cuentas Registradas',
      value: accounts.length,
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
      link: '/cuentas',
    },
    {
      label: 'Conciertos',
      value: concerts.length,
      icon: '🎵',
      color: 'from-purple-500 to-purple-600',
      link: '/conciertos',
    },
    {
      label: 'Total de Boletos',
      value: tickets.length,
      icon: '🎫',
      color: 'from-pink-500 to-pink-600',
      link: '/conciertos',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            🎫 Gestión de Boletos
          </h1>
          <p className="text-xl text-white/90">
            Sistema completo para administrar tus boletos de conciertos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.link}>
              <Card hover className="h-full cursor-pointer">
                <CardBody className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-gray-600 font-medium mt-1">{stat.label}</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="animate-scale-in">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">Acciones Rápidas</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/cuentas">
                <Button className="w-full" size="lg">
                  ➕ Nueva Cuenta
                </Button>
              </Link>
              <Link href="/conciertos">
                <Button className="w-full" variant="secondary" size="lg">
                  🎵 Nuevo Concierto
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Getting Started */}
        {accounts.length === 0 && (
          <Card className="border-2 border-primary-300 bg-primary-50/50">
            <CardBody>
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800">
                  👋 ¡Bienvenido!
                </h3>
                <p className="text-gray-700">
                  Para comenzar, crea tu primera cuenta en la sección de <strong>Cuentas</strong>.
                  Luego podrás registrar conciertos y gestionar tus boletos.
                </p>
                <Link href="/cuentas">
                  <Button>Ir a Cuentas</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
