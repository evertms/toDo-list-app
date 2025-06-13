import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTasksByCategory } from '../services/taskService';
import type { Task } from '../models/Task';

export const useTasksByCategory = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const result = await getTasksByCategory(id as string);
        if (result.success && result.data) {
          setTasks(result.data);
        } else {
          setError(result.error || 'No se pudieron cargar las tareas');
        }
      } catch (err) {
        setError('No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [id]);

  return { tasks, loading, error, categoryId: id };
};