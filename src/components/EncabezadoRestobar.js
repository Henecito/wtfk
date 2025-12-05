import React, { useEffect } from "react";
import logo from "../assets/img/logo.png";
import { useSucursal } from "../hooks/useSucursal";

export default function EncabezadoCartaMinimalista({
  onLocalizarTienda,
  modoEntrega,
  setModoEntrega,
  sucursalSeleccionada,
}) {
  const botonesBloqueados = !sucursalSeleccionada;

  const idSucursal =
    typeof sucursalSeleccionada === "object" && sucursalSeleccionada !== null
      ? sucursalSeleccionada.id
      : sucursalSeleccionada;

  const { sucursal, cargando } = useSucursal(idSucursal);
  console.log("🟡 ID FINAL enviado al hook:", idSucursal);

  // 🔥 LOGS DE DEPURACIÓN
  useEffect(() => {
    console.log("🟡 ID Sucursal seleccionada:", sucursalSeleccionada);
    console.log("🟢 Datos sucursal obtenidos:", sucursal);
    console.log("⏳ Cargando:", cargando);
  }, [sucursalSeleccionada, sucursal, cargando]);

  return (
    <header
      className="d-flex flex-wrap justify-content-between align-items-center px-4 py-3 border-bottom"
      style={{
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Logo + botón localizar */}
      <div className="d-flex align-items-center gap-3 mb-3 mb-md-0 flex-grow-1">
        <img
          src={logo}
          alt="logo"
          style={{
            height: 48,
            width: 48,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span className="fw-semibold" style={{ letterSpacing: 2 }}>
          Entregallos
        </span>
        <button
          className="btn btn-outline-dark rounded-pill px-3 fw-semibold ms-2"
          onClick={onLocalizarTienda}
        >
          <i className="bi bi-geo-alt-fill me-2"></i>Localizar Tienda
        </button>
      </div>

      {/* Botones modo entrega */}
      <div className="d-flex gap-2 mb-3 mb-md-0 justify-content-center flex-grow-1 order-3 order-md-0">
        <button
          className={`btn rounded-pill px-4 fw-semibold ${
            modoEntrega === "retiro" ? "btn-dark" : "btn-outline-dark"
          }`}
          disabled={botonesBloqueados}
          onClick={() => setModoEntrega("retiro")}
        >
          Retiro
        </button>

        <button
          className={`btn rounded-pill px-4 fw-semibold ${
            modoEntrega === "domicilio" ? "btn-dark" : "btn-outline-dark"
          }`}
          disabled={botonesBloqueados}
          onClick={() => setModoEntrega("domicilio")}
        >
          A domicilio
        </button>
      </div>

      {/* Información sucursal */}
      <div
        className="d-none d-md-flex flex-column text-end ms-md-4 flex-grow-1"
        style={{ fontSize: 14 }}
      >
        {!sucursalSeleccionada && (
          <span className="text-muted">Selecciona una sucursal</span>
        )}

        {cargando && <span className="text-muted">Cargando sucursal...</span>}

        {!cargando && sucursal && (
          <>
            <span className="fw-semibold text-dark">{sucursal.nombre}</span>
            <span className="text-muted">{sucursal.direccion}</span>
            <span className="text-muted">
              Atención: {sucursal.horario_atencion}
            </span>
            <span className="text-muted">
              Repartos: {sucursal.horario_reparto}
            </span>
          </>
        )}
      </div>
    </header>
  );
}
