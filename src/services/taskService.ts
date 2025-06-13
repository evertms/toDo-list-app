import { supabase } from '../utils/supabaseClient';
import { type Task } from '../models/Task'

export async function getAllTasks() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('No se pudo obtener el usuario autenticado');
    }

    const { data, error } = await supabase
      .from('tareas')
      .select('*, categorias(nombre)')
      .eq('user_id', user.id)
      .is('deleted_at', null);

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error('Error al cargar tareas:', err);
    return { success: false, error: 'No se pudieron cargar las tareas' };
  }
}

export async function getTasksByCategory(categoryId: string): 
Promise<{ success: boolean; data?: Task[]; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      throw new Error('No se pudo obtener el usuario autenticado');
    }

    const { data, error } = await supabase
      .from('tareas')
      .select('*, categorias(nombre)')
      .eq('categoria_id', categoryId)
      .eq('user_id', user.id)
      .is('deleted_at', null);

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error('Error al obtener tareas por categoría:', err);
    return { success: false, error: 'No se pudieron cargar las tareas de esta categoría' };
  }
}

export async function createTask(task: {
  titulo: string;
  descripcion: string;
  fecha: string;
  categoria_id: string;
  user_id: string;
}) {
  try {
    const { error } = await supabase.from('tareas').insert(task);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error al crear tarea:', err);
    return { success: false, error: 'No se pudo crear la tarea' };
  }
}

export async function updateTaskStatus(taskId: string, completed: boolean) {
  try {
    const { error } = await supabase
      .from('tareas')
      .update({ estado: completed })
      .eq('id', taskId)

    if (error) throw error;

    return { success: true }; 
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    return { success: false, error: 'No se puede actualizar el estado.' };
  }
}

export async function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'deleted_at'>>) {
  try {
    const { error } = await supabase
      .from('tareas')
      .update(updates)
      .eq('id', taskId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    return { success: false, error: 'No se pudo actualizar la tarea' };
  }
}

export async function softDeleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tareas')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error al eliminar (lógicamente) la tarea:', err);
    return { success: false, error: 'No se pudo eliminar la tarea' };
  }
}

export async function getTaskById(taskId: string): 
Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      throw new Error('No se pudo obtener el usuario autenticado');
    }

    const { data, error } = await supabase
      .from('tareas')
      .select('*, categorias(nombre)')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Tarea no encontrada' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error al obtener tarea por ID:', err);
    return { success: false, error: 'No se pudo cargar la tarea' };
  }
}