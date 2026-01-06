'use client';

import { useState, useEffect } from 'react';
import { Account } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar cuentas desde localStorage
  useEffect(() => {
    const loadedAccounts = storage.get<Account[]>(STORAGE_KEYS.ACCOUNTS) || [];
    setAccounts(loadedAccounts);
    setLoading(false);
  }, []);

  // Guardar cuentas en localStorage cuando cambien
  useEffect(() => {
    if (!loading) {
      storage.set(STORAGE_KEYS.ACCOUNTS, accounts);
    }
  }, [accounts, loading]);

  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = (id: string, accountData: Partial<Omit<Account, 'id' | 'createdAt'>>) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, ...accountData } : account
      )
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  };

  const getAccountById = (id: string) => {
    return accounts.find((account) => account.id === id);
  };

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
  };
}
