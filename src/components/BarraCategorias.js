import React from "react";

const categorias = [
  "Todas",
  "Pizzas",
  "Bebidas",
  "Hamburguesas",
  "Entradas",
  "Combos"
];

export default function BarraCategorias({ activa, setActiva }) {
  return (
    <div
      className="d-flex gap-2 mb-4 flex-row overflow-auto"
      style={{
        padding: "0.5rem",
        whiteSpace: "nowrap",
      }}
    >
      {categorias.map(cat => (
        <button
          key={cat}
          className={`btn rounded-pill px-4 fw-semibold ${activa === cat ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setActiva(cat)}
          style={{
            minWidth: 110,
            flexShrink: 0, 
            whiteSpace: "normal",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
