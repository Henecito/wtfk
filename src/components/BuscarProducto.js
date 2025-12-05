import React from "react";

export default function BuscarProducto({ valor, setValor }) {
  return (
    <div className="mb-4">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Buscar productos por nombre"
        value={valor}
        onChange={e => setValor(e.target.value)}
        style={{ borderRadius: 20, maxWidth: 400 }}
      />
    </div>
  );
}
