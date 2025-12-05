import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useExtras(abierto) {
  const [extrasDisponibles, setExtrasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    async function cargarExtras() {
      setCargando(true);
      const { data, error } = await supabase
        .from("extras")
        .select("*");

      if (error) {
        console.error("Error cargando extras:", error);
        setExtrasDisponibles([]);
      } else {
        setExtrasDisponibles(data || []);
      }
      setCargando(false);
    }

    cargarExtras();
  }, [abierto]);

  return { extrasDisponibles, cargando };
}
