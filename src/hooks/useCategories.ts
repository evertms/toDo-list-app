import { useEffect, useState, useCallback } from 'react';
import supabase from '../utils/supabaseClient';
import { getCategories } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Usuario no autenticado');
      }

      const result = await getCategories(user.id);

      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, refetch };
};