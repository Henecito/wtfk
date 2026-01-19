import React, { useState } from "react";
import Swal from "sweetalert2";

import { useProductos } from "../hooks/useProductos";
import { useCarrito } from "../hooks/useCarrito";
import { useCartaDigitalLogica } from "./CartaDigitalLogica";

import CartaDigitalVista from "./CartaDigitalVista";
import ModalConfirmacionDomicilio from "./ModalDelivery";
import ModalRetiro from "./ModalRetiro";

export default function CartaDigital() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // modales
  const [mostrarModalDelivery, setMostrarModalDelivery] = useState(false);
  const [mostrarModalRetiro, setMostrarModalRetiro] = useState(false);

  const { carrito, agregar, eliminar, vaciar } = useCarrito();

  const {
    ubicacionCliente,
    sucursalSeleccionada,
    modoEntrega,
    setModoEntrega,
    localizarTienda,
    finalizarPedido,
  } = useCartaDigitalLogica(carrito, vaciar);

  const { productos, cargando: cargandoProductos } = useProductos(
    sucursalSeleccionada?.id
  );

  function abrirModal(producto) {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  }

  /* ================= CONFIRMACIONES ================= */

  function confirmarDatosDomicilio(data) {
    finalizarPedido(data);
    setMostrarModalDelivery(false);
  }

  function confirmarDatosRetiro(data) {
    finalizarPedido(data);
    setMostrarModalRetiro(false);
  }

  function manejarFinalizarPedido() {
    if (modoEntrega === "domicilio") {
      setMostrarModalDelivery(true);
      return;
    }

    if (modoEntrega === "retiro") {
      setMostrarModalRetiro(true);
      return;
    }

    Swal.fire("Error", "Debes seleccionar retiro o delivery", "error");
  }

  /* ================= FILTRO ================= */

  const productosFiltrados = productos.filter(
    (prod) =>
      (categoriaActiva === "Todas" || prod.categoria === categoriaActiva) &&
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  /* ================= RENDER ================= */

  return (
    <>
      <CartaDigitalVista
        sucursalSeleccionada={sucursalSeleccionada}
        modoEntrega={modoEntrega}
        setModoEntrega={setModoEntrega}
        localizarTienda={localizarTienda}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        cargandoProductos={cargandoProductos}
        productosFiltrados={productosFiltrados}
        abrirModal={abrirModal}
        carrito={carrito}
        eliminar={eliminar}
        vaciar={vaciar}
        finalizarPedido={manejarFinalizarPedido}
        productoSeleccionado={productoSeleccionado}
        modalAbierto={modalAbierto}
        cerrarModal={cerrarModal}
        agregar={agregar}
      />

      {/* ===== MODAL DELIVERY ===== */}
      <ModalConfirmacionDomicilio
        abierto={mostrarModalDelivery}
        onCerrar={() => setMostrarModalDelivery(false)}
        ubicacionCliente={ubicacionCliente}
        onConfirmarDomicilio={confirmarDatosDomicilio}
      />

      {/* ===== MODAL RETIRO ===== */}
      <ModalRetiro
        abierto={mostrarModalRetiro}
        onCerrar={() => setMostrarModalRetiro(false)}
        onConfirmarRetiro={confirmarDatosRetiro}
      />
    </>
  );
}
