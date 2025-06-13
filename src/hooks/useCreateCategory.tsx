import { useState } from 'react';
import { createCategory } from '../services/categoryService';

export const useCreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateCategoryName = (name: string) => {
    if (!name.trim()) {
      setError('El nombre no puede estar vacío');
      return false;
    }
    if (name.length > 100) {
      setError(`Máximo 100 caracteres (actual: ${name.length})`);
      return false;
    }
    return true;
  };

  const submitCategory = async (user_id: string) => {
    if (!validateCategoryName(categoryName)) return { success: false };
    
    setLoading(true);
    try {
      const result = await createCategory(categoryName, user_id);
      if (!result.success) throw new Error(result.error || 'Error al crear categoría');
      return { success: true, data: result.data };
    } catch (err) {
      setError('No se pudo crear la categoría');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    categoryName,
    setCategoryName,
    error,
    loading,
    submitCategory,
  };
};