// src/hooks/useProductos.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useProductos(sucursalId) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarProductos() {
      if (!sucursalId) {
        setProductos([]);
        return;
      }

      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("sucursal_id", sucursalId)
        .eq("activo", true); // 👈 SOLO PRODUCTOS ACTIVOS

      if (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
      } else {
        setProductos(data);
      }

      setCargando(false);
    }

    cargarProductos();
  }, [sucursalId]);

  return { productos, cargando };
}
