'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { LoginMethod } from '@/types';

interface AccountFormProps {
  onSubmit: (data: { 
    email: string; 
    password?: string; 
    phone: string;
    loginMethod: LoginMethod;
  }) => void;
  initialData?: { 
    email: string; 
    password?: string; 
    phone: string;
    loginMethod: LoginMethod;
  };
  submitLabel?: string;
  onCancel?: () => void;
}

export function AccountForm({ 
  onSubmit, 
  initialData, 
  submitLabel = 'Crear Cuenta',
  onCancel 
}: AccountFormProps) {
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(
    initialData?.loginMethod || LoginMethod.PASSWORD
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!email || !phone) return;
    if (loginMethod === LoginMethod.PASSWORD && !password) return;

    onSubmit({ 
      email, 
      password: loginMethod === LoginMethod.PASSWORD ? password : undefined,
      phone,
      loginMethod
    });
    
    // Reset form if not editing
    if (!initialData) {
      setEmail('');
      setPassword('');
      setPhone('');
      setLoginMethod(LoginMethod.PASSWORD);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Editar Cuenta' : 'Nueva Cuenta'}
        </h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Inicio de Sesión
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginMethod"
                  value={LoginMethod.PASSWORD}
                  checked={loginMethod === LoginMethod.PASSWORD}
                  onChange={(e) => setLoginMethod(e.target.value as LoginMethod)}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-gray-700">🔑 Contraseña</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginMethod"
                  value={LoginMethod.GOOGLE}
                  checked={loginMethod === LoginMethod.GOOGLE}
                  onChange={(e) => setLoginMethod(e.target.value as LoginMethod)}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-gray-700">🔵 Google</span>
              </label>
            </div>
          </div>

          {loginMethod === LoginMethod.PASSWORD && (
            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          )}

          <Input
            label="Teléfono"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+52 123 456 7890"
            required
          />

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
