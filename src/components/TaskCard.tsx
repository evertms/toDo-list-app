import React, { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

// Tipos
type Category =
  | 'laborales'
  | 'personales'
  | 'salud'
  | 'familiares'
  | 'aprendizaje'
  | 'hogar'
  | 'ocio'
  | 'financieras';

type TaskCardProps = {
  id: string;
  title: string;
  dueDate: string;
  category: Category;
  completed: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

// Mapeo de categorías a colores suaves
const CATEGORY_COLORS: Record<Category, string> = {
  laborales: 'bg-blue-100 border-l-4 border-blue-500',
  personales: 'bg-purple-100 border-l-4 border-purple-500',
  salud: 'bg-green-100 border-l-4 border-green-500',
  familiares: 'bg-yellow-100 border-l-4 border-yellow-500',
  aprendizaje: 'bg-indigo-100 border-l-4 border-indigo-500',
  hogar: 'bg-pink-100 border-l-4 border-pink-500',
  ocio: 'bg-teal-100 border-l-4 border-teal-500',
  financieras: 'bg-red-100 border-l-4 border-red-500',
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

  // Manejar clic derecho
  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Cerrar menú contextual al hacer clic fuera
  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  // Manejar acción de completado sin afectar el link
  const handleCheckboxClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(id);
  };

  return (
    <div
      className={`relative ${
        CATEGORY_COLORS[category] || DEFAULT_COLOR
      } rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('input')) return;
      }}
      onContextMenu={handleRightClick}
    >
      
        <div className="flex items-start">
          {/* Checkbox personalizado */}
          <div className="flex items-center mr-4" onClick={handleCheckboxClick}>
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
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

          {/* Contenido de la tarjeta */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p
              className={`text-sm ${
                isPastDue(dueDate) ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              Vence: {new Date(dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      

      {/* Menú contextual */}
      {showContextMenu && (
        <div
          className="absolute bg-white border rounded-md shadow-lg z-10"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
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

      {/* Overlay para cerrar menú al hacer clic fuera */}
      {showContextMenu && (
        <div
          className="fixed inset-0 w-full h-full bg-transparent z-5"
          onClick={handleClickOutside}
        ></div>
      )}
    </div>
  );
};

export default TaskCard;