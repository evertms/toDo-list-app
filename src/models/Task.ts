export interface Task {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha: string;
  estado: boolean;
  categorias: { nombre: string };
  user_id?: string;
  deleted_at?: string | null;
}