import { supabase } from "../supabaseClient";

export async function obtenerSucursalPorId(id) {
  const { data, error } = await supabase
    .from("sucursales")
    .select(`
      id,
      nombre,
      direccion,
      horario_atencion,
      horario_reparto,
      telefono,
      correo_electronico
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
