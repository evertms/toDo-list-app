import { useEffect, useState } from 'react';
import { getAllTasks } from '../services/taskService';
import { type Task } from '../models/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const result = await getAllTasks();
        if (result.success && result.data) {
          setTasks(result.data);
        } else {
          throw new Error(result.error || 'Error al cargar tareas');
        }
      } catch (err) {
        setError('No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return { tasks, setTasks, loading, error };
};