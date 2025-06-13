import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateTask } from '../hooks/useCreateTask';
import Button from '../components/Button';

const NewTask: React.FC = () => {
  const navigate = useNavigate();
  const { id: defaultCategoryId } = useParams<{ id?: string }>();
  const {
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
  } = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitTask();
    if (result?.success) {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (defaultCategoryId && categories.length > 0) {
      setCategoryId(defaultCategoryId);
    }
  }, [defaultCategoryId, categories]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl font-bold mb-4 pl-6 pt-6">To-Do List</h1>
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-bold mb-6">Crear nueva tarea</h2>
        
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
          </div>

          <div className="space-y-4">
            <label htmlFor="description" className="block text-left mb-2 text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 border rounded-lg
                ${descriptionError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Descripción opcional"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 text-right">{description.length}/500</p>
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
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              text="Crear tarea"
              isLoading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTask;