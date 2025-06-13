import { useEffect, useState } from 'react';
import { getAuthenticatedUserProfile } from '../services/userService';

export const useProfile = () => {
  const [profile, setProfile] = useState<{
    id: string;
    nombre: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getAuthenticatedUserProfile();
        if (result.success && result.data) {
          setProfile({
            id: result.data.id,
            nombre: result.data.nombre,
            email: result.data.email,
          });
        }
      } catch (err) {
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profile, loading, error };
};