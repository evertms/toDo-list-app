import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTasks } from '../hooks/useTasks';
import { getTasksByCategory } from '../services/taskService';
import TaskView from '../components/TaskView';
import type { Task } from '../models/Task';

const TasksByCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks: allTasks, setTasks } = useTasks();
  const { toggleComplete, editTask, deleteTask } = useTaskMutations(setTasks);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryTasks, setCategoryTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getTasksByCategory(id as string);
        if (result.success && result.data) {
          setCategoryTasks(result.data);
          
          setTasks(prevTasks => {
            const otherTasks = prevTasks.filter(task => 
              task.categorias?.nombre !== result.data?.[0]?.categorias?.nombre
            );
            return [...otherTasks, ...(result.data || [])];
          });
        } else {
          setError(result.error || 'No se pudieron cargar las tareas');
        }
      } catch (err) {
        setError('No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTasks();
    }
  }, [id, setTasks]);

  const tasksByCategory = useMemo(() => {
    if (categoryTasks.length === 0) return [];
    
    const categoryName = categoryTasks[0]?.categorias?.nombre;
    return allTasks.filter(task => 
      task.categorias?.nombre === categoryName
    );
  }, [allTasks, categoryTasks]);

  const displayTasks = tasksByCategory.length > 0 ? tasksByCategory : categoryTasks;
  const categoryName = displayTasks[0]?.categorias?.nombre || 'Categoría';

  return (
    <TaskView
      title={`Tareas de la categoría ${categoryName}`}
      tasks={displayTasks}
      loading={loading}
      error={error}
      onToggleComplete={toggleComplete}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
};

export default TasksByCategory;