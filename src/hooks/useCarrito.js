import { useState } from "react";

export function useCarrito() {
  const [carrito, setCarrito] = useState([]);

  const agregar = (producto) => setCarrito((prev) => [...prev, producto]);

  const eliminar = (idx) => setCarrito((prev) => prev.filter((_, i) => i !== idx));

  const vaciar = () => setCarrito([]);

  return { carrito, agregar, eliminar, vaciar };
}
