import React from "react";

const defaultImg = "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80";

export default function ProductoCard({ producto, onClick }) {
  return (
    <div className="card h-100 border-0 shadow-sm" onClick={() => onClick(producto)} style={{ cursor: "pointer" }}>
      <img
        src={producto.img || defaultImg}
        className="card-img-top"
        alt={producto.nombre}
        style={{ height: 140, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
      />
      <div className="card-body d-flex flex-column text-center">
        <h6 className="card-title fw-bold mb-1">{producto.nombre}</h6>
        <div className="text-muted small mb-2">{producto.categoria}</div>
        <div className="mb-3 fw-semibold" style={{ fontSize: 19 }}>${producto.precio}</div>
      </div>
    </div>
  );
}
