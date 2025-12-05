import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useSucursal(idSucursal) {
  const [sucursal, setSucursal] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!idSucursal) return;

    const obtenerSucursal = async () => {
      setCargando(true);

      const { data, error } = await supabase
        .from("sucursales")
        .select("*")
        .eq("id", idSucursal)   // 🔥 CLAVE: usar ID, no local_id
        .single();

      if (error) {
        console.error("❌ Error Supabase:", error.message);
        setSucursal(null);
      } else {
        setSucursal(data);
      }

      setCargando(false);
    };

    obtenerSucursal();
  }, [idSucursal]);

  return { sucursal, cargando };
}
