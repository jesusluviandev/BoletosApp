'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/cuentas', label: 'Cuentas' },
    { href: '/conciertos', label: 'Conciertos' },
  ];

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-accent-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-white text-xl font-bold">🎫 Boletos App</h1>
            <div className="flex space-x-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <button 
            onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' }); // Or call server action via wrapper
                // Since actions are direct, let's use a smallclient wrapper or just import
                // But we cannot import server action in client component directly if unused properly? 
                // We fan import it.
                const { logout } = await import('@/app/actions');
                await logout();
            }}
            className="text-white/80 hover:text-white font-medium px-4 py-2 hover:bg-white/10 rounded-lg transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
