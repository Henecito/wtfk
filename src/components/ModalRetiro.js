import React, { useState } from "react";

export default function ModalRetiro({
  abierto,
  onCerrar,
  onConfirmarRetiro,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  function confirmar() {
    if (!nombre.trim()) return alert("Ingresa tu nombre");
    if (!telefono.trim()) return alert("Ingresa tu teléfono");

    const data = {
      tipoEntrega: "retiro",
      nombre,
      telefono,
    };

    onConfirmarRetiro(data);
  }

  if (!abierto) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4">

          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              Datos para retiro en local
            </h5>
            <button className="btn-close" onClick={onCerrar}></button>
          </div>

          <div className="modal-body">

            <label className="fw-semibold">Nombre</label>
            <input
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />

            <label className="fw-semibold mt-3">Teléfono</label>
            <input
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+56 9 ..."
            />

            <small className="text-muted d-block mt-3">
              Te avisaremos a este número cuando tu pedido esté listo.
            </small>

          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onCerrar}>
              Cancelar
            </button>
            <button className="btn btn-dark fw-bold" onClick={confirmar}>
              Confirmar pedido
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
