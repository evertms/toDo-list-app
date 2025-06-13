import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import TaskList from './TaskList';
import Button from './Button';
import type { Task } from '../models/Task';

interface TaskViewProps {
  title: string;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskView: React.FC<TaskViewProps> = ({
  title,
  tasks,
  loading,
  error,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const { pendingTasks, completedTasks } = useMemo(() => {
    const pending = tasks.filter(task => !task.estado);
    const completed = tasks.filter(task => task.estado);
    return { pendingTasks: pending, completedTasks: completed };
  }, [tasks]);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl font-bold mb-4 pl-6 pt-6">To-Do List</h1>
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        <TaskList
          tasks={pendingTasks}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        
        {completedTasks.length > 0 && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-200"></div>
              <div className="px-4 text-sm text-gray-500 font-medium bg-white">
                Completadas ({completedTasks.length})
              </div>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            
            <div className="opacity-75">
              <TaskList
                tasks={completedTasks}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Link to={`/task/new/`}>
          <Button text="Agregar tarea" />
        </Link>
      </div>
    </div>
  );
};

export default TaskView;