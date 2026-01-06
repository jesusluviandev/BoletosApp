'use client';

import { useState } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { AccountForm } from '@/components/AccountForm';
import { AccountList } from '@/components/AccountList';
import { Account, LoginMethod } from '@/types';
import toast from 'react-hot-toast';

export default function CuentasPage() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleAddAccount = (data: { 
    email: string; 
    password?: string; 
    phone: string;
    loginMethod: LoginMethod;
  }) => {
    addAccount(data);
    toast.success('✅ Cuenta creada exitosamente');
  };

  const handleUpdateAccount = (data: { 
    email: string; 
    password?: string; 
    phone: string;
    loginMethod: LoginMethod;
  }) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, data);
      toast.success('✅ Cuenta actualizada exitosamente');
      setEditingAccount(null);
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            👤 Gestión de Cuentas
          </h1>
          <p className="text-lg text-white/90">
            Administra las cuentas de plataforma para adquirir boletos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 animate-slide-up">
            <AccountForm 
              onSubmit={editingAccount ? handleUpdateAccount : handleAddAccount}
              initialData={editingAccount || undefined}
              submitLabel={editingAccount ? 'Actualizar Cuenta' : 'Crear Cuenta'}
              onCancel={editingAccount ? handleCancelEdit : undefined}
            />
          </div>

          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <AccountList 
              accounts={accounts} 
              onDelete={deleteAccount}
              onEdit={handleEditAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
