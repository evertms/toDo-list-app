import { supabase } from "../utils/supabaseClient";

export async function loginWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true, user: data.user };
}

export async function registerUser(email: string, password: string, nombre: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) return { success: false, message: authError.message };

    const user = authData.user;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user?.id, nombre});

    if (profileError) return { success: false, message: profileError.message};

    const defaultCategory = { nombre: 'General', user_id: user?.id };

    const { error: categoriesError } = await supabase
      .from('categorias')
      .insert(defaultCategory);

    if (categoriesError) return { success: false, error: categoriesError.message };
    
    return { success: true, user };
}