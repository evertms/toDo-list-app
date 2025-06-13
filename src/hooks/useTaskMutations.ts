import { useNavigate } from 'react-router-dom';
import { updateTaskStatus, softDeleteTask } from '../services/taskService';
import type { Task } from '../models/Task';

export const useTaskMutations = (setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const navigate = useNavigate();

  const toggleComplete = async (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, estado: !task.estado } : task
      )
    );

    const result = await updateTaskStatus(id, true);
    
    if (!result.success) {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, estado: false } : task
        )
      );
      alert('No se pudo actualizar el estado');
    }
  };

  const editTask = (id: string) => {
    navigate(`/task/edit/${id}`);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    const result = await softDeleteTask(id);
    
    if (!result.success) {
      alert('No se pudo eliminar la tarea');
    }
  };

  return { toggleComplete, editTask, deleteTask };
};