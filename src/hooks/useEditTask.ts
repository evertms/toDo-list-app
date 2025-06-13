import { useState, useEffect } from 'react';
import { getTaskById, updateTask, softDeleteTask } from '../services/taskService';
import { getCategories } from '../services/categoryService';
import supabase from '../utils/supabaseClient';
import type { Task } from '../models/Task';
import type { Category } from '../models/Category';

interface UseEditTaskReturn {
  task: Task | null;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  categories: Category[];
  loading: boolean;
  error: string | null;
  titleError: string | null;
  descriptionError: string | null;
  categoryError: string | null;
  dateError: string | null;
  taskNotFound: boolean;
  loadingDelete: boolean;
  submitTask: () => Promise<{ success: boolean } | null>;
  deleteTask: () => Promise<{ success: boolean } | null>;
}

export const useEditTask = (taskId: string): UseEditTaskReturn => {
  const [task, setTask] = useState<Task | null>(null);
  const [taskNotFound, setTaskNotFound] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    const loadTaskAndCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setError('Usuario no autenticado');
          return;
        }

        const taskResult = await getTaskById(taskId);
        if (taskResult.success && taskResult.data) {
          const taskData = taskResult.data;
          setTask(taskData);
          
          setTitle(taskData.titulo || '');
          setDescription(taskData.descripcion || '');
          
          if (taskData.fecha) {
            const date = new Date(taskData.fecha);
            const formattedDate = date.toISOString().split('T')[0];
            setDueDate(formattedDate);
          }
          
        } else {
          setTaskNotFound(true);
          setError('Tarea no encontrada');
        }

        const categoriesResult = await getCategories(user.id);
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
          
          if (taskResult.success && taskResult.data) {
            const taskCategory = taskResult.data.categorias?.nombre;
            const matchingCategory = categoriesResult.data.find(
              cat => cat.nombre === taskCategory
            );
            if (matchingCategory) {
              setCategoryId(matchingCategory.id);
            }
          }
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading task and categories:', err);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTaskAndCategories();
    }
  }, [taskId]);

  const validateForm = (): boolean => {
    let isValid = true;
    
    setTitleError(null);
    setDescriptionError(null);
    setCategoryError(null);
    setDateError(null);

    if (!title.trim()) {
      setTitleError('El título es obligatorio');
      isValid = false;
    } else if (title.length > 100) {
      setTitleError('El título no puede exceder 100 caracteres');
      isValid = false;
    }

    if (description.length > 500) {
      setDescriptionError('La descripción no puede exceder 500 caracteres');
      isValid = false;
    }

    if (!categoryId) {
      setCategoryError('Debes seleccionar una categoría');
      isValid = false;
    }

    if (!dueDate) {
      setDateError('La fecha límite es obligatoria');
      isValid = false;
    } else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        setDateError('La fecha límite no puede ser anterior a hoy');
        isValid = false;
      }
    }

    return isValid;
  };

  const submitTask = async (): Promise<{ success: boolean } | null> => {
    if (!validateForm()) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = {
        titulo: title.trim(),
        descripcion: description.trim(),
        fecha: dueDate,
        categoria_id: categoryId,
      };

      const result = await updateTask(taskId, taskData);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error || 'Error al actualizar la tarea');
        return { success: false };
      }
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error('Error updating task:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (): Promise<{ success: boolean } | null> => {
    setLoadingDelete(true);
    setError(null);

    try {
      const result = await softDeleteTask(taskId);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error || 'Error al eliminar la tarea');
        return { success: false };
      }
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error('Error deleting task:', err);
      return { success: false };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    task,
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
    taskNotFound,
    loadingDelete,
    submitTask,
    deleteTask: handleDeleteTask,
  };
};