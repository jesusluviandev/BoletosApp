'use client';

import { useState } from 'react';
import { Account, LoginMethod } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface AccountPurchaseModeProps {
  accounts: Account[];
}

export function AccountPurchaseMode({ accounts }: AccountPurchaseModeProps) {
  const [visibleAccounts, setVisibleAccounts] = useState<Set<string>>(
    new Set(accounts.map(acc => acc.id))
  );

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`📋 ${label} copiado al portapapeles`);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const markAsDone = (accountId: string) => {
    setVisibleAccounts(prev => {
      const newSet = new Set(prev);
      newSet.delete(accountId);
      return newSet;
    });
    toast.success('✅ Cuenta marcada como lista');
  };

  const filteredAccounts = accounts.filter(acc => visibleAccounts.has(acc.id));

  if (filteredAccounts.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Todas las cuentas procesadas!
            </h3>
            <p className="text-gray-600">
              Has marcado todas las cuentas como listas.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🎫 Modo Compra de Boletos</h2>
            <p className="text-sm opacity-90 mt-1">
              Cuentas disponibles: {filteredAccounts.length}
            </p>
          </div>
          <div className="text-3xl">🛒</div>
        </div>
      </div>

      {filteredAccounts.map((account) => {
        const isPasswordLogin = account.loginMethod === LoginMethod.PASSWORD;

        return (
          <Card key={account.id} hover>
            <CardBody>
              <div className="flex items-center justify-between gap-4">
                {/* Account Info */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {account.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate mb-1">
                      {account.email}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      isPasswordLogin 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isPasswordLogin ? '🔑 Contraseña/Otro' : '🔵 Google'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(account.email, 'Email')}
                  >
                    📧 Copiar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => markAsDone(account.id)}
                  >
                    ✅ Listo
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
