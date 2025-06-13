import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';
import { createTask } from '../services/taskService';
import supabase from '../utils/supabaseClient';

export const useCreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const loadCategories = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const result = await getCategories(user.id);
    if (result.success && result.data) {
      setCategories(result.data);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validateForm = () => {
    let isValid = true;

    if (title.trim().length < 3) {
      setTitleError(true);
      isValid = false;
    } else {
      setTitleError(false);
    }

    if (description.length > 500) {
      setDescriptionError(true);
      isValid = false;
    } else {
      setDescriptionError(false);
    }

    if (!categoryId) {
      setCategoryError(true);
      isValid = false;
    } else {
      setCategoryError(false);
    }

    if (!dueDate) {
      setDateError(true);
      isValid = false;
    } else {
      setDateError(false);
    }

    return isValid;
  };

  const submitTask = async () => {
    setError(null);
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const newTask = {
        titulo: title,
        descripcion: description,
        fecha: dueDate,
        estado: false,
        categoria_id: categoryId,
        user_id: user.id,
      };

      const result = await createTask(newTask);
      if (!result.success) throw new Error(result.error || 'Error al crear tarea');

      setTitle('');
      setDescription('');
      setDueDate('');
      setCategoryId('');

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    categoryId,
    setCategoryId,
    categories,
    loading,
    error,
    titleError,
    descriptionError,
    categoryError,
    dateError,
    submitTask,
  };
};