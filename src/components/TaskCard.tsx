import React, { useState, type MouseEvent, useRef } from 'react';
import { Link } from 'react-router-dom';

type TaskCardProps = {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  completed: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const DEFAULT_COLOR = 'bg-gray-100 border-l-4 border-gray-400';

// Función para validar si la fecha está vencida
const isPastDue = (dueDate: string): boolean => {
  const today = new Date();
  const taskDate = new Date(dueDate);
  return taskDate < today;
};

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  dueDate,
  category,
  completed,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const relativeX = e.clientX - cardRect.left;
      const relativeY = e.clientY - cardRect.top;
      
      setContextMenuPosition({ x: relativeX, y: relativeY });
      setShowContextMenu(true);
    }
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  const handleCheckboxClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(id);
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${
        DEFAULT_COLOR
      } rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg w-full`}
      onContextMenu={handleRightClick}
    >
      <div className="flex items-start">
        <div className="flex items-center mr-4" onClick={handleCheckboxClick}>
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
              completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
            }`}
          >
            {completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        <Link to={`/task/${id}`} className="flex-1 block">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p
              className={`text-sm ${
                isPastDue(dueDate) ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              Vence: {new Date(dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-800">{category}</p>
          </div>
        </Link>
      </div>
      

      {showContextMenu && (
        <div
          className="absolute bg-white border rounded-md shadow-lg z-20 min-w-48"
          style={{ 
            left: `${contextMenuPosition.x}px`, 
            top: `${contextMenuPosition.y}px`
          }}
        >
          <ul className="py-1 text-sm">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onEdit(id);
                setShowContextMenu(false);
              }}
            >
              Editar
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onToggleComplete(id);
                setShowContextMenu(false);
              }}
            >
              {completed
                ? 'Marcar como no completada'
                : 'Marcar como completada'}
            </li>
            <li
              className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={() => {
                onDelete(id);
                setShowContextMenu(false);
              }}
            >
              Eliminar
            </li>
          </ul>
        </div>
      )}

      {showContextMenu && (
        <div
          className="fixed inset-0 w-full h-full bg-transparent z-10"
          onClick={handleClickOutside}
        ></div>
      )}
    </div>
  );
};

export default TaskCard;