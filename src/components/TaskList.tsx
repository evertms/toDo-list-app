import React from 'react';
import TaskCard from './TaskCard';
import { type Task } from '../models/Task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList : React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4 w-full max-w-full">
      {tasks.length === 0 ?  (
        <p className="text-center text-gray-500">No hay tareas registradas</p>
      ) : (
        tasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.titulo}
            dueDate={task.fecha}
            category={task.categorias.nombre}
            completed={task.estado}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            />
        ))
      )
    }
    </div>
  );
};

export default TaskList;