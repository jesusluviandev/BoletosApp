'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/cuentas', label: 'Cuentas' },
    { href: '/conciertos', label: 'Conciertos' },
  ];

  const handleLogout = async () => {
    const { logout } = await import('@/app/actions');
    await logout();
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black shadow-xl sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold flex items-center gap-2">
              🎫 <span className="hidden sm:inline">Boletos App</span>
              <span className="sm:hidden">BoletosApp</span>
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
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
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white font-medium px-4 py-2 hover:bg-gray-800 rounded-lg transition-all ml-4"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-white text-gray-900'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
