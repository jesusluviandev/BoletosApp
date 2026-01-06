import { getAccounts } from '@/app/actions';
import { AccountManager } from '@/components/AccountManager';

export const dynamic = 'force-dynamic';

export default async function CuentasPage() {
  const accounts = await getAccounts();

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

        <AccountManager accounts={accounts} />
      </div>
    </div>
  );
}
