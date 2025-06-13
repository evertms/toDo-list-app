import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { loginWithEmail } from '../services/authService';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginWithEmail(email, password);
      if (!result.success) {
        throw new Error(result.message);
      }
      onSuccess?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-center">Iniciar sesión</h1>
      <p className="text-center text-gray-600">Bienvenido de nuevo</p>

      <div className="space-y-4">
        <label htmlFor="email" className="block text-left mb-2 text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="email@example.com"
          required
          autoComplete='off'
        />
      
        <label htmlFor="password" className="block mb-2 text-left text-sm font-medium">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex justify-center mt-4 text-sm">
        <p>¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-500 font-medium">
            Regístrate
          </Link>
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          text="Iniciar sesión"
          isLoading={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default LoginForm;