import React, { useState } from "react";
import { useExtras } from "../hooks/useExtras";

export default function ModalProducto({ producto, abierto, onCerrar, onAgregar }) {
  const { extrasDisponibles, cargando } = useExtras(abierto);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  const [comentario, setComentario] = useState("");
  const [mostrarExtras, setMostrarExtras] = useState(false);

  if (!abierto || !producto) return null;

  function toggleExtra(id) {
    setExtrasSeleccionados(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  }

  const precioExtras = extrasDisponibles
    .filter(e => extrasSeleccionados.includes(e.id))
    .reduce((acc, e) => acc + Number(e.precio), 0);

  const precioTotal = producto.precio + precioExtras;

  function handleAgregar() {
    const productoConExtras = {
      ...producto,
      extras: extrasDisponibles.filter(e => extrasSeleccionados.includes(e.id)),
      precioTotal,
      comentario
    };
    onAgregar(productoConExtras);
    onCerrar();
    setExtrasSeleccionados([]);
    setComentario("");
    setMostrarExtras(false);
  }

  return (
    <div
      className="modal d-flex align-items-center justify-content-center"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.18)",
        zIndex: 1050,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
        padding: "1rem",
      }}
      onClick={onCerrar}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: 400,
          width: "100%",
          margin: "auto auto 4rem auto", 
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0 px-3 py-2" style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)'
        }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{producto.nombre}</h5>
            <button type="button" className="btn-close" onClick={onCerrar}></button>
          </div>
          <div className="modal-body text-center pt-0">
            <img
              src={
                producto.img ||
                "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80"
              }
              alt={producto.nombre}
              className="img-fluid rounded-4 mb-3"
              style={{ minHeight: 120, objectFit: "cover", maxHeight: 190 }}
            />
            {producto.descripcion && (
              <div className="mb-2 text-muted text-start" style={{ fontSize: 15 }}>{producto.descripcion}</div>
            )}
            <div className="mb-3 fw-semibold" style={{ fontSize: 22 }}>${producto.precio}</div>

            {/* Botón para mostrar/ocultar extras */}
            {extrasDisponibles.length > 0 && (
              <div className="mb-3 text-start">
                <button
                  className="btn btn-outline-secondary mb-2"
                  onClick={() => setMostrarExtras(prev => !prev)}
                >
                  {mostrarExtras ? "Ocultar extras" : "Agregar extras"}
                </button>

                {mostrarExtras && (
                  cargando ? (
                    <div>Cargando extras...</div>
                  ) : (
                    extrasDisponibles.map(extra => (
                      <div key={extra.id} className="form-check mb-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={extra.id}
                          id={extra.id}
                          checked={extrasSeleccionados.includes(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                        />
                        <label className="form-check-label" htmlFor={extra.id}>
                          {extra.nombre} <span className="text-muted">+${extra.precio}</span>
                        </label>
                      </div>
                    ))
                  )
                )}
              </div>
            )}

            <div className="mb-3 text-start">
              <label htmlFor="comentario" className="fw-bold mb-2" style={{ fontSize: 15 }}>
                Comentario (pedido especial, quitar algún ingrediente, etc)
              </label>
              <textarea
                id="comentario"
                className="form-control rounded-3"
                style={{ resize: 'none', minHeight: 44 }}
                placeholder="Ej: sin cebolla, con doble salsa, etc."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />
            </div>

            <div className="fw-bold mt-3" style={{ fontSize: 19 }}>
              Total: ${precioTotal}
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-center gap-3">
            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={handleAgregar}
              style={{ fontWeight: 600, fontSize: 16 }}
            >
              Agregar al carrito
            </button>
            <button className="btn btn-outline-dark rounded-pill px-4" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
