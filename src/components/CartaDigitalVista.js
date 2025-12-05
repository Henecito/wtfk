import React from "react";
import EncabezadoCartaMinimalista from "./EncabezadoRestobar";
import BuscarProducto from "./BuscarProducto";
import BarraCategorias from "./BarraCategorias";
import ProductoCard from "./ProductoCard";
import ModalProducto from "./ModalProducto";
import CarritoPanel from "./CarritoVista";

// 🔥 NUEVO: importamos el ModalDelivery (lo crearemos al final)
import ModalDelivery from "./ModalDelivery";

export default function CartaDigitalVista({
  sucursalSeleccionada,
  modoEntrega,
  setModoEntrega,
  localizarTienda,
  busqueda,
  setBusqueda,
  categoriaActiva,
  setCategoriaActiva,
  cargandoProductos,
  productosFiltrados,
  abrirModal,
  carrito,
  eliminar,
  vaciar,
  finalizarPedido,
  productoSeleccionado,
  modalAbierto,
  cerrarModal,
  agregar,

  // 🔥 NUEVO
  mostrarModalDelivery,
  setMostrarModalDelivery,
}) {
  return (
    <div>
      <EncabezadoCartaMinimalista
        onLocalizarTienda={localizarTienda}
        modoEntrega={modoEntrega}
        setModoEntrega={setModoEntrega}
        sucursalSeleccionada={sucursalSeleccionada}
      />

      <div className="container my-4">
        {!sucursalSeleccionada ? (
          <div className="text-center p-5 text-secondary">
            Debes localizar la tienda más cercana para ver la carta.
          </div>
        ) : (
          <>
            <h2 className="fw-bold mb-3">
              Carta{" "}
              <span className="text-secondary fw-normal">
                - {sucursalSeleccionada.nombre}
              </span>
            </h2>

            <div className="row">
              <div className="col-lg-8">
                <div
                  className="card shadow-sm p-4 mb-4"
                  style={{ borderRadius: 24 }}
                >
                  <BuscarProducto valor={busqueda} setValor={setBusqueda} />
                  <BarraCategorias
                    activa={categoriaActiva}
                    setActiva={setCategoriaActiva}
                  />

                  <div
                    className="row mt-3"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    {cargandoProductos ? (
                      <div className="p-5 text-center text-muted">
                        Cargando productos...
                      </div>
                    ) : productosFiltrados.length === 0 ? (
                      <div className="p-5 text-center text-muted">
                        No hay productos disponibles
                      </div>
                    ) : (
                      productosFiltrados.map((producto) => (
                        <div
                          key={producto.id}
                          className="col-md-6 col-xl-4 mb-4"
                        >
                          <ProductoCard
                            producto={producto}
                            onClick={abrirModal}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <CarritoPanel
                  productos={carrito}
                  onEliminar={eliminar}
                  onVaciar={vaciar}
                  onFinalizar={finalizarPedido}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <ModalProducto
        producto={productoSeleccionado}
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        onAgregar={agregar}
      />
    </div>
  );
}
