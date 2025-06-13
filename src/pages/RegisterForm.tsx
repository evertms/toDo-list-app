import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { registerUser } from '../services/authService';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError(false);
    setPasswordError(false);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setPasswordError(true);
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser(email, password, name);
      
      if (!result.success) {
        if (result.message && result.message.includes('already been registered')) {
          setEmailError(true);
          setError('Este correo ya está registrado');
        } else {
          setError(result.message || 'Error desconocido');
        }
        setIsLoading(false);
        return;
      }

      onSuccess?.();
      navigate('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-center">Regístrate</h1>
      <p className="text-center text-gray-600">Bienvenido. ¡Gracias por elegirnos!</p>

      <div className="space-y-4">
        <label htmlFor="text" className="block text-left mb-2 text-sm font-medium">
          Nombre completo
        </label>
        <input
          type="text"
          id="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Juan Jose Perez"
          required
          autoComplete="off"
        />
        <label htmlFor="email" className="block text-left mb-2 text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
          }}
          className={`w-full p-3 border rounded-lg
            ${emailError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="email@example.com"
          required
          autoComplete="off"
        />

        <label htmlFor="password" className="block mb-2 text-left text-sm font-medium">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          className={`w-full p-3 border rounded-lg
            ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="••••••••"
          required
        />

        <label htmlFor="confirmPassword" className="block mb-2 text-left text-sm font-medium">
          Confirmar contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordError(false);
          }}
          className={`w-full p-3 border rounded-lg
            ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex justify-center mt-4 text-sm">
        <p>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-500 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          text="Regístrate"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default RegisterForm;