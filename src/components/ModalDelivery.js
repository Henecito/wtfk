import React, { useState, useEffect, useRef } from "react";

export default function ModalConfirmacionDomicilio({
  abierto,
  onCerrar,
  ubicacionCliente,
  onConfirmarDomicilio,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [usarUbicacion, setUsarUbicacion] = useState(true);
  const [direccionManual, setDireccionManual] = useState("");
  const [referencias, setReferencias] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [direccionAuto, setDireccionAuto] = useState("");
  const [cargandoDir, setCargandoDir] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);

  const [coordenadas, setCoordenadas] = useState(null);
  const mapaRef = useRef(null);
  const markerRef = useRef(null);

  /* ================= LEAFLET ================= */

  useEffect(() => {
    if (window.L) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    document.body.appendChild(script);
  }, []);

  /* ================= COORDENADAS ================= */

  useEffect(() => {
    if (abierto && ubicacionCliente) {
      setCoordenadas({
        lat: ubicacionCliente.lat,
        lon: ubicacionCliente.lon,
      });
    }
  }, [abierto, ubicacionCliente]);

  /* ================= MAPA ================= */

  useEffect(() => {
    if (!abierto || !coordenadas || !window.L) return;

    const timer = setTimeout(() => {
      const mapElement = document.getElementById("mapa-delivery");
      if (!mapElement) return;

      if (mapaRef.current) {
        mapaRef.current.remove();
        mapaRef.current = null;
      }

      try {
        const map = window.L.map("mapa-delivery", {
          center: [coordenadas.lat, coordenadas.lon],
          zoom: 16,
        });

        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap",
            maxZoom: 19,
          }
        ).addTo(map);

        const marker = window.L.marker([coordenadas.lat, coordenadas.lon], {
          draggable: true,
        }).addTo(map);

        marker.on("dragend", async function () {
          const pos = marker.getLatLng();
          setCoordenadas({ lat: pos.lat, lon: pos.lng });

          try {
            setCargandoDir(true);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`
            );
            const data = await res.json();
            setDireccionAuto(data.display_name || "Dirección no disponible");
          } catch (error) {
            setDireccionAuto("No se pudo obtener la dirección");
          } finally {
            setCargandoDir(false);
          }
        });

        mapaRef.current = map;
        markerRef.current = marker;

        setTimeout(() => map.invalidateSize(), 100);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (mapaRef.current) {
        mapaRef.current.remove();
        mapaRef.current = null;
      }
    };
  }, [abierto, coordenadas]);

  /* ================= USAR UBICACIÓN ================= */

  useEffect(() => {
    if (
      !usarUbicacion ||
      !ubicacionCliente ||
      !mapaRef.current ||
      !markerRef.current
    )
      return;

    const nuevaPos = { lat: ubicacionCliente.lat, lon: ubicacionCliente.lon };
    setCoordenadas(nuevaPos);

    markerRef.current.setLatLng([nuevaPos.lat, nuevaPos.lon]);
    mapaRef.current.setView([nuevaPos.lat, nuevaPos.lon], 16);

    (async () => {
      try {
        setCargandoDir(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${nuevaPos.lat}&lon=${nuevaPos.lon}&format=json`
        );
        const data = await res.json();
        setDireccionAuto(data.display_name || "Dirección no disponible");
      } catch (error) {
        setDireccionAuto("No se pudo obtener la dirección");
      } finally {
        setCargandoDir(false);
      }
    })();
  }, [usarUbicacion, ubicacionCliente]);

  /* ================= BUSCADOR PRECISO ================= */

  useEffect(() => {
    if (!direccionManual || usarUbicacion) {
      setSugerencias([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const lat = ubicacionCliente?.lat;
        const lon = ubicacionCliente?.lon;

        const url =
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(direccionManual)}` +
          `&format=json` +
          `&addressdetails=1` +
          `&limit=5` +
          `&countrycodes=cl` +
          (lat && lon
            ? `&viewbox=${lon - 0.2},${lat + 0.2},${lon + 0.2},${lat - 0.2}&bounded=1`
            : "");

        const res = await fetch(url);
        const data = await res.json();
        setSugerencias(data);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [direccionManual, usarUbicacion, ubicacionCliente]);

  /* ================= CONFIRMAR ================= */

  function confirmar() {
    if (!nombre.trim()) return alert("Por favor ingresa tu nombre.");
    if (!telefono.trim())
      return alert("Por favor ingresa tu número de contacto.");
    if (!usarUbicacion && !direccionManual.trim())
      return alert("Por favor ingresa tu dirección manual.");

    const data = {
      tipoEntrega: "delivery",
      nombre,
      telefono,
      direccion:
        usarUbicacion && direccionAuto
          ? direccionAuto
          : direccionManual || "Sin dirección",
      coordenadas: usarUbicacion ? coordenadas : null,
      referencias,
      comentarios,
    };

    onConfirmarDomicilio(data);
  }

  if (!abierto) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: 20 }}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              Datos de entrega a domicilio
            </h5>
            <button className="btn-close" onClick={onCerrar}></button>
          </div>

          <div className="modal-body">
            <label className="fw-semibold mt-2">Nombre</label>
            <input
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />

            <label className="fw-semibold mt-3">WhatsApp / Teléfono</label>
            <input
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+56 9 ..."
            />

            <label className="fw-semibold mt-3">Dirección</label>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={usarUbicacion}
                onChange={() => setUsarUbicacion(true)}
              />
              <label className="form-check-label">
                Usar ubicación actual
                <br />
                <small className="text-muted">
                  {cargandoDir
                    ? "Obteniendo dirección..."
                    : direccionAuto || "Sin dirección"}
                </small>
              </label>
            </div>

            {(usarUbicacion || (!usarUbicacion && coordenadas)) && (
              <>
                <div
                  id="mapa-delivery"
                  style={{
                    height: "300px",
                    width: "100%",
                    marginTop: "15px",
                    marginBottom: "10px",
                    borderRadius: "10px",
                    border: "2px solid #dee2e6",
                    backgroundColor: "#e9ecef",
                  }}
                >
                  {!window.L && (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <span className="text-muted">Cargando mapa...</span>
                    </div>
                  )}
                </div>
                <small className="text-muted d-block">
                  💡 Mueve el marcador para ajustar tu ubicación exacta
                </small>
              </>
            )}

            <div className="form-check mt-3 mb-2">
              <input
                className="form-check-input"
                type="radio"
                checked={!usarUbicacion}
                onChange={() => setUsarUbicacion(false)}
              />
              <label className="form-check-label">
                Ingresar dirección manual
              </label>
            </div>

            {!usarUbicacion && (
              <div style={{ position: "relative" }}>
                <input
                  className="form-control mb-2"
                  value={direccionManual}
                  onChange={(e) => setDireccionManual(e.target.value)}
                  placeholder="Calle, número, comuna..."
                  autoComplete="off"
                />
                {sugerencias.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 1100, maxHeight: 150, overflowY: "auto" }}
                  >
                    {sugerencias.map((item) => (
                      <li
                        key={item.place_id}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setDireccionManual(item.display_name);
                          const nuevaCoordenada = {
                            lat: Number(item.lat),
                            lon: Number(item.lon),
                          };
                          setCoordenadas(nuevaCoordenada);
                          setSugerencias([]);

                          if (markerRef.current && mapaRef.current) {
                            markerRef.current.setLatLng([
                              nuevaCoordenada.lat,
                              nuevaCoordenada.lon,
                            ]);
                            mapaRef.current.setView(
                              [nuevaCoordenada.lat, nuevaCoordenada.lon],
                              16
                            );
                          }
                        }}
                      >
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <label className="fw-semibold mt-3">Referencias</label>
            <textarea
              className="form-control"
              rows="2"
              value={referencias}
              onChange={(e) => setReferencias(e.target.value)}
              placeholder="Punto de referencia, color del portón..."
            />

            <label className="fw-semibold mt-3">Comentarios</label>
            <textarea
              className="form-control"
              rows="2"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Instrucciones extras"
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onCerrar}>
              Cancelar
            </button>
            <button
              className="btn btn-dark fw-bold"
              onClick={confirmar}
              disabled={cargandoDir}
            >
              {cargandoDir ? "Cargando..." : "Finalizar pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
