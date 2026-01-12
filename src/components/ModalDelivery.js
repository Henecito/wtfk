import React, { useEffect, useRef, useState } from "react";

export default function ModalConfirmacion({
  abierto,
  onCerrar,
  ubicacionCliente,
  onConfirmarDomicilio,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [referencias, setReferencias] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [direccion, setDireccion] = useState("");

  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);
  const googleMapRef = useRef(null);

  /* ================= INIT MAP ================= */

  useEffect(() => {
    if (!abierto || !window.google || !ubicacionCliente) return;

    setTimeout(() => {
      const center = {
        lat: ubicacionCliente.lat,
        lng: ubicacionCliente.lon,
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 16,
        disableDefaultUI: true,
      });

      const marker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });

      googleMapRef.current = map;
      markerRef.current = marker;

      // Reverse geocode al mover pin
      marker.addListener("dragend", async () => {
        const pos = marker.getPosition();
        map.panTo(pos);
        await reverseGeocode(pos.lat(), pos.lng());
      });

      // Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["geometry", "formatted_address"],
          componentRestrictions: { country: "cl" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const loc = place.geometry.location;
        map.setCenter(loc);
        marker.setPosition(loc);
        setDireccion(place.formatted_address);
      });

      reverseGeocode(center.lat, center.lng);
    }, 300);
  }, [abierto, ubicacionCliente]);

  /* ================= REVERSE ================= */

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBHeNuhtM-s14YORRoNuFjvzXlAw68o_kU`
      );
      const data = await res.json();
      if (data.results?.[0]) {
        setDireccion(data.results[0].formatted_address);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /* ================= CONFIRM ================= */

  function confirmar() {
    if (!nombre.trim()) return alert("Ingresa tu nombre");
    if (!telefono.trim()) return alert("Ingresa tu teléfono");
    if (!markerRef.current) return;

    const pos = markerRef.current.getPosition();

    const data = {
      tipoEntrega: "delivery",
      nombre,
      telefono,
      direccion,
      coordenadas: {
        lat: pos.lat(),
        lon: pos.lng(),
      },
      referencias,
      comentarios,
    };

    onConfirmarDomicilio(data);
  }

  if (!abierto) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4">

          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              Dirección de entrega
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

            <label className="fw-semibold mt-3">Buscar dirección</label>
            <input
              ref={inputRef}
              className="form-control"
              placeholder="Calle, número, comuna..."
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />

            <div
              ref={mapRef}
              style={{
                height: 320,
                width: "100%",
                marginTop: 15,
                borderRadius: 12,
              }}
            />

            <small className="text-muted d-block mt-2">
              Mueve el marcador si deseas ajustar el punto exacto
            </small>

            <label className="fw-semibold mt-3">Referencias</label>
            <textarea
              className="form-control"
              rows="2"
              value={referencias}
              onChange={(e) => setReferencias(e.target.value)}
              placeholder="Portón negro, casa esquina, etc."
            />

            <label className="fw-semibold mt-3">Comentarios</label>
            <textarea
              className="form-control"
              rows="2"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Indicaciones extras"
            />
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
