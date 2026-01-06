'use client';

import { useState } from 'react';
import { Account, LoginMethod } from '@/types';
import { AccountForm } from '@/components/AccountForm';
import { AccountList } from '@/components/AccountList';
import { createAccount, updateAccount, deleteAccount } from '@/app/actions';
import toast from 'react-hot-toast';

interface AccountManagerProps {
  accounts: Account[];
}

export function AccountManager({ accounts }: AccountManagerProps) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleAddAccount = async (data: { 
    email: string; 
    phone?: string;
    loginMethod: LoginMethod;
  }) => {
    const result = await createAccount(data);
    if (result.success) {
      toast.success('✅ Cuenta creada exitosamente');
    } else {
      toast.error('❌ Error al crear cuenta');
    }
  };

  const handleUpdateAccount = async (data: { 
    email: string; 
    phone?: string;
    loginMethod: LoginMethod;
  }) => {
    if (editingAccount) {
      const result = await updateAccount(editingAccount.id, data);
      if (result.success) {
        toast.success('✅ Cuenta actualizada exitosamente');
        setEditingAccount(null);
      } else {
        toast.error('❌ Error al actualizar cuenta');
      }
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const result = await deleteAccount(id);
    if (result.success) {
      toast.success('🗑️ Cuenta eliminada');
    } else {
      toast.error('❌ Error al eliminar cuenta');
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  return (
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
          onDelete={handleDeleteAccount}
          onEdit={handleEditAccount}
        />
      </div>
    </div>
  );
}
