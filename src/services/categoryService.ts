import { supabase } from '../utils/supabaseClient';

export async function createCategory(nombre: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .insert({ nombre, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error('Error al crear categoría:', err);
    return { success: false, error: 'No se pudo crear la categoría' };
  }
}

export async function getCategories(userId: string) {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    return { success: false, error: 'No se pudieron cargar las categorías' };
  }
}

export async function getAllCategoriesWithDeleted(userId: string) {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    return { success: false, error: 'No se pudieron cargar las categorías' };
  }
}

export async function updateCategory(categoryId: string, newName: string) {
  try {
    const { error } = await supabase
      .from('categorias')
      .update({ nombre: newName })
      .eq('id', categoryId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    return { success: false, error: 'No se pudo actualizar la categoría' };
  }
}

export async function softDeleteCategory(categoryId: string) {
  try {
    const { data: tasks, error: taskError } = await supabase
      .from('tareas')
      .select('id')
      .eq('categoria_id', categoryId);

    if (taskError) throw taskError;

    if ((tasks?.length || 0) > 0) {
      return {
        success: false,
        error: 'No se puede eliminar esta categoría porque tiene tareas asociadas',
      };
    }

    const { error: deleteError } = await supabase
      .from('categorias')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', categoryId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    return { success: false, error: 'No se pudo eliminar la categoría' };
  }
}