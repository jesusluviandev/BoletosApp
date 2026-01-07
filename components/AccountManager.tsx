'use client';

import { useState } from 'react';
import { Account, LoginMethod } from '@/types';
import { AccountForm } from '@/components/AccountForm';
import { AccountList } from '@/components/AccountList';
import { AccountPurchaseMode } from '@/components/AccountPurchaseMode';
import { createAccount, updateAccount, deleteAccount } from '@/app/actions';
import toast from 'react-hot-toast';

interface AccountManagerProps {
  accounts: Account[];
}

export function AccountManager({ accounts }: AccountManagerProps) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isPurchaseMode, setIsPurchaseMode] = useState(false);

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
    <div className="space-y-6">
      {/* Toggle Button for Purchase Mode */}
      <div className="flex justify-end animate-slide-up">
        <button
          onClick={() => setIsPurchaseMode(!isPurchaseMode)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            isPurchaseMode
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
          }`}
        >
          {isPurchaseMode ? '🔙 Volver a Gestión Normal' : '🛒 Modo Compra de Boletos'}
        </button>
      </div>

      {/* Conditional Rendering */}
      {isPurchaseMode ? (
        <div className="animate-slide-up">
          <AccountPurchaseMode accounts={accounts} />
        </div>
      ) : (
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
      )}
    </div>
  );
}
