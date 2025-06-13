import supabase from '../utils/supabaseClient';
import { type Profile } from '../models/Profile';

export async function updateUserName(newName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('No se pudo obtener la sesión del usuario');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ nombre: newName, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (profileError) throw profileError;

    return { success: true };
  } catch (err) {
    console.error('Error al actualizar el nombre:', err);
    return { success: false, error: 'No se pudo actualizar el nombre' };
  }
}

export async function getAuthenticatedUserProfile(): Promise<{ success: boolean; data?: Profile; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    return {
      success: true,
      data: {
        id: user.id,
        nombre: profile?.nombre || 'Usuario',
        email: user.email || 'correo@desconocido.com',
        updated_at: profile?.updated_at || null,
      },
    };
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    return { success: false, error: 'No se pudo cargar el perfil del usuario' };
  }
}