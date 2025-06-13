import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useCategories } from '../hooks/useCategories';
import { useProfile } from '../hooks/useProfile';
import { useClickOutside } from '../hooks/useClickOutside';
import { createCategory } from '../services/categoryService';
import Button from './Button';

const Sidebar: React.FC = () => {
  const { categories, loading: loadingCategories, error: categoryError, refetch } = useCategories();
  const { profile, loading: loadingProfile, error: profileError } = useProfile();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const profileMenuRef = useClickOutside(() => setIsProfileMenuOpen(false));
  const modalRef = useClickOutside(() => {
    setIsModalOpen(false);
    setCategoryName('');
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim() || categoryName.length > 100) return;
    
    setIsCreating(true);
    try {
      const result = await createCategory(categoryName.trim(), profile?.id || '');
      if (result.success) {
        setIsModalOpen(false);
        setCategoryName('');
        refetch();
      } else {
        alert('Error al crear la categoría');
      }
    } catch (error) {
      alert('Error al crear la categoría');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateCategory();
    }
  };

  if (loadingProfile || loadingCategories) {
    return (
      <aside className="w-full h-full bg-white p-4">
        <p>Cargando perfil y categorías...</p>
      </aside>
    );
  }

  if (profileError || categoryError) {
    return (
      <aside className="w-full h-full bg-white p-4">
        <p className="text-red-500">{profileError || categoryError}</p>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-full h-full bg-white border-r border-gray-200">
        <div className="p-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <div>
              <h3 className="font-bold">{profile?.nombre || 'Usuario'}</h3>
              <p className="text-sm text-gray-600">{profile?.email || 'correo@ejemplo.com'}</p>
            </div>
          </div>

          {isProfileMenuOpen && (
            <div 
              ref={profileMenuRef} 
              className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <nav className="mt-6">
          <div className="px-4">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md"
            >
              <span>Todas</span>
            </Link>
          </div>

          <div className="px-4 mt-6">
            <p className="text-sm text-gray-500 font-medium">Categorías</p>
          </div>

          <div className="px-4 mt-2">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-800">{category.nombre}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500 text-sm">
                <p>No hay categorías</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Button 
              text="Agregar categoría" 
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </nav>
      </aside>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-96 max-w-md mx-4"
          >
            <h2 className="text-lg font-semibold mb-4">Insertar nombre de categoría</h2>
            
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nombre de la categoría"
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              disabled={isCreating}
            />
            
            <div className="text-right text-xs text-gray-500 mt-1">
              {categoryName.length}/100
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCategoryName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isCreating}
              >
                Cancelar
              </button>
              
              <button
                onClick={handleCreateCategory}
                disabled={!categoryName.trim() || isCreating}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? 'Creando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;