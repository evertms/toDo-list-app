import { useState } from 'react';
import './App.css';
import Button from './components/Button';
import TaskCard from './components/TaskCard';

// Datos falsos inicializados en estado
const mockTasks = [
  {
    id: '1',
    title: 'Finalizar informe',
    dueDate: '2025-06-10',
    category: 'laborales',
    completed: false,
  },
  {
    id: '2',
    title: 'Ir al médico',
    dueDate: '2024-05-01',
    category: 'salud',
    completed: true,
  },
];

function App() {
  // Guardar las tareas en estado para poder modificarlas
  const [tasks, setTasks] = useState(mockTasks);

  // Función para actualizar el estado de completado
  const handleToggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    console.log("")
  };

  const handleEdit = (id: string) => {
    alert(`Editar tarea ${id}`);
  };

  const onDelete = (id: string) => {
    alert(`Eliminar tarea ${id}`);
  };

  return (
    <>
      <div className="space-x-4 p-4">
        <Button text="Hecha" />
        <Button text="Eliminar" />
        <Button text="No hecha" />
        <Button text="Default" />
      </div>

      <div className="p-4 space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            dueDate={task.dueDate}
            category={task.category as any}
            completed={task.completed}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}

export default App;