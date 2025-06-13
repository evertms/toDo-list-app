import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditTask } from '../hooks/useEditTask';
import Button from '../components/Button';

const EditTask: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
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
    submitTask,
    deleteTask,
    loadingDelete,
    taskNotFound
  } = useEditTask(id as string);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitTask();
    if (result?.success) {
      navigate('/dashboard');
    }
  };

  const handleDelete = async () => {
    const result = await deleteTask();
    if (result?.success) {
      navigate('/dashboard');
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (taskNotFound) {
    return (
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-bold mb-4 pl-6 pt-6">To-Do List</h1>
        <div className="px-6 pb-6">
          <div className="text-center py-8">
            <p className="text-red-500 text-lg mb-4">Tarea no encontrada</p>
            <Button 
              text="Volver al Dashboard" 
              onClick={() => navigate('/dashboard')} 
            />
          </div>
        </div>
      </div>
    );
  }

  if (loading && !task) {
    return (
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-bold mb-4 pl-6 pt-6">To-Do List</h1>
        <div className="px-6 pb-6">
          <p>Cargando tarea...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl font-bold mb-4 pl-6 pt-6">To-Do List</h1>
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-bold mb-6">
          {task?.estado ? '✅ ' : '⏳ '}
          Editar tarea
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-8 rounded-lg">
          <div className="space-y-4">
            <label htmlFor="title" className="block text-left mb-2 text-sm font-medium">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 border rounded-lg
                ${titleError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Título de la tarea"
              required
            />
            {titleError && (
              <p className="text-red-500 text-sm">{titleError}</p>
            )}
          </div>

          <div className="space-y-4">
            <label htmlFor="description" className="block text-left mb-2 text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 border rounded-lg min-h-[120px]
                ${descriptionError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Descripción de la tarea"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 text-right">{description.length}/500</p>
            {descriptionError && (
              <p className="text-red-500 text-sm">{descriptionError}</p>
            )}
          </div>

          <div className="space-y-4">
            <label htmlFor="dueDate" className="block text-left mb-2 text-sm font-medium">
              Fecha límite
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full p-3 border rounded-lg
                ${dateError ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {dateError && (
              <p className="text-red-500 text-sm">{dateError}</p>
            )}
          </div>

          <div className="space-y-4">
            <label htmlFor="category" className="block text-left mb-2 text-sm font-medium">
              Categoría
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full p-3 border rounded-lg
                ${categoryError ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {categoryError && (
              <p className="text-red-500 text-sm">{categoryError}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-left mb-2 text-sm font-medium">
              Estado
            </label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <span className={`text-lg ${task?.estado ? 'text-green-600' : 'text-yellow-600'}`}>
                {task?.estado ? '✅' : '⏳'}
              </span>
              <span className="text-gray-700">
                {task?.estado ? 'Completada' : 'Pendiente'}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="mt-8 flex flex-col space-y-4">
            <div className="flex justify-center">
              <Button
                text="Guardar cambios"
                isLoading={loading}
              />
            </div>

            <div className="flex justify-center">
              {!showDeleteConfirm ? (
                <Button
                  text="Eliminar"
                  onClick={confirmDelete}
                  isLoading={loadingDelete}
                />
              ) : (
                <div className="flex space-x-4">
                  <Button
                    text="Confirmar eliminación"
                    onClick={handleDelete}
                    isLoading={loadingDelete}
                  />
                  <Button
                    text="Cancelar"
                    onClick={cancelDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        {task && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Información de la tarea</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Vencimiento:</span> {task.fecha ? new Date(task.fecha).toLocaleDateString() : 'N/A'}</p>
              <p><span className="font-medium">Categoría:</span> {task.categorias?.nombre || 'Sin categoría'}</p>
              <p><span className="font-medium">Estado:</span> {task.estado ? 'Completada' : 'Pendiente'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTask;