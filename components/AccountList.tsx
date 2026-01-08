'use client';

import { Account, LoginMethod } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { confirmDialog } from '@/lib/confirmDialog';

interface AccountListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
  onEdit: (account: Account) => void;
}

export function AccountList({ accounts, onDelete, onEdit }: AccountListProps) {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`📋 ${label} copiado al portapapeles`);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500 py-8">
            No hay cuentas registradas. Crea tu primera cuenta arriba.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => {
        const isPasswordLogin = account.loginMethod === LoginMethod.PASSWORD;

        return (
          <Card key={account.id} hover>
            <CardBody>
              <div className="space-y-4">
                {/* Header with email and login method badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {account.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0"> {/* min-w-0 ensures truncation works */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{account.email}</h3>
                        <span className={`self-start sm:self-auto px-2 py-1 rounded-full text-xs font-medium ${
                          isPasswordLogin 
                            ? 'bg-gray-200 text-gray-800 border border-gray-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {isPasswordLogin ? '🔑 Contraseña/Otro' : '🔵 Google'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">📱 {account.phone || 'Sin teléfono'}</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(account.email, 'Email')}
                  >
                    📧 Copiar Email
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(account)}
                  >
                    ✏️ Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      const confirmed = await confirmDialog({
                        title: '¿Estás seguro de eliminar esta cuenta?',
                        description: `Se eliminará la cuenta de ${account.email}`,
                      });
                      
                      if (confirmed) {
                        onDelete(account.id);
                      }
                    }}
                  >
                    🗑️ Eliminar
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
