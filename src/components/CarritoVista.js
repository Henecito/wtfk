import React from "react";

export default function CarritoPanel({
  productos,
  onEliminar,
  onEditar,
  onVaciar,
  onFinalizar,
}) {
  const totalGeneral = productos.reduce(
    (acc, prod) => acc + prod.precioTotal,
    0
  );

  return (
    <div
      className="bg-white rounded-4 shadow px-4 pb-4 pt-3"
      style={{
        maxWidth: 440,
        minHeight: 340,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        border: "1px solid #ececec",
      }}
    >
      <h2 className="fw-bold mb-3" style={{ fontSize: 25 }}>
        Mi pedido
      </h2>
      <hr />
      {productos.length === 0 ? (
        <div className="text-center text-muted py-4" style={{ fontSize: 17 }}>
          El carrito está vacío
        </div>
      ) : (
        <>
          {productos.map((producto, i) => (
            <div
              key={i}
              className="mb-4 pb-2"
              style={{ borderBottom: "1.8px solid #e5e5e5" }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold" style={{ fontSize: 21 }}>
                    {producto.nombre}
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: 6 }}>
                    <span className="text-secondary" style={{ fontSize: 17 }}>
                      (x1)
                    </span>
                    <span
                      className="fw-bold"
                      style={{ color: "#e53935", fontSize: 18 }}
                    >
                      ${Number(producto.precioTotal).toLocaleString("es-CL")}
                    </span>
                  </div>
                  {producto.extras && producto.extras.length > 0 && (
                    <div className="text-muted" style={{ fontSize: 15 }}>
                      Extras: {producto.extras.map((e) => e.nombre).join(", ")}
                    </div>
                  )}
                  {producto.comentario && (
                    <div
                      className="text-muted fst-italic"
                      style={{ fontSize: 15 }}
                    >
                      "{producto.comentario}"
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <button
                    className="btn btn-link p-0 text-primary"
                    style={{
                      fontWeight: 600,
                      fontSize: 17,
                      textDecoration: "none",
                    }}
                    onClick={() => onEditar?.(i)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn p-0"
                    onClick={() => onEliminar(i)}
                    style={{
                      background: "none",
                      border: "none",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="#9e9e9e"
                    >
                      <rect x="5" y="7" width="14" height="12" rx="2.5" />
                      <rect
                        x="9"
                        y="11"
                        width="1.5"
                        height="5.5"
                        rx="0.75"
                        fill="#fff"
                      />
                      <rect
                        x="13.5"
                        y="11"
                        width="1.5"
                        height="5.5"
                        rx="0.75"
                        fill="#fff"
                      />
                      <rect x="8" y="3" width="8" height="3" rx="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            className="pt-1 mt-2"
            style={{ borderTop: "2px dashed #e5e5e5" }}
          >
            <div
              className="fw-bold mb-1"
              style={{ fontSize: 20, marginTop: 8 }}
            >
              Resumen
            </div>
            <div
              className="d-flex justify-content-between align-items-center mb-2"
              style={{ fontSize: 18 }}
            >
              <span className="fw-normal text-secondary">Subtotal</span>
              <span className="fw-bold">
                ${totalGeneral.toLocaleString("es-CL")}
              </span>
            </div>
            <div
              className="fw-bold d-flex align-items-center justify-content-between"
              style={{ fontSize: 22, marginTop: 10 }}
            >
              <span>Total</span>
              <span style={{ color: "#e53935" }}>
                ${totalGeneral.toLocaleString("es-CL")}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between gap-2 mt-4">
            <button
              className="btn btn-outline-dark rounded-pill px-3"
              onClick={onVaciar}
              disabled={productos.length === 0}
              style={{ fontWeight: 600, fontSize: 16 }}
            >
              Vaciar
            </button>
            <button
              className="btn btn-dark rounded-pill px-3"
              onClick={onFinalizar}
              disabled={productos.length === 0}
              style={{ fontWeight: 600, fontSize: 16 }}
            >
              Finalizar
            </button>
          </div>
        </>
      )}
      <style>
        {`
          @media (max-width: 767.98px) {
            div.bg-white.rounded-4.shadow {
              margin-left: auto !important;
              margin-right: auto !important;
              max-width: 100% !important;
              min-height: auto !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}
