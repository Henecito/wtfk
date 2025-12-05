import React, { useState } from "react";
import { useProductos } from "../hooks/useProductos";
import { useCarrito } from "../hooks/useCarrito";
import { useCartaDigitalLogica } from "./CartaDigitalLogica";
import CartaDigitalVista from "./CartaDigitalVista";
import ModalConfirmacionDomicilio from "./ModalDelivery";

export default function CartaDigital() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Modal para datos de delivery
  const [mostrarModalDelivery, setMostrarModalDelivery] = useState(false);

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

  // Recibe los datos desde el modal y finaliza el pedido
  function confirmarDatosDomicilio(data) {
    finalizarPedido(data);
    setMostrarModalDelivery(false);
  }

  // Intercepta finalizar pedido cuando es domicilio
  function manejarFinalizarPedido() {
    if (modoEntrega === "domicilio") {
      setMostrarModalDelivery(true);
      return;
    }
    finalizarPedido();
  }

  const productosFiltrados = productos.filter(
    (prod) =>
      (categoriaActiva === "Todas" || prod.categoria === categoriaActiva) &&
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        mostrarModalDelivery={mostrarModalDelivery}
        setMostrarModalDelivery={setMostrarModalDelivery}
      />

      {/* 🔥 Modal conectado correctamente */}
      <ModalConfirmacionDomicilio
        abierto={mostrarModalDelivery}
        onCerrar={() => setMostrarModalDelivery(false)}
        ubicacionCliente={ubicacionCliente}
        onConfirmarDomicilio={confirmarDatosDomicilio}
      />
    </>
  );
}
