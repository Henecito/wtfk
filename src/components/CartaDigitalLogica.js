import { useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useCartaDigitalLogica(carrito, vaciar) {
  const [ubicacionCliente, setUbicacionCliente] = useState(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [modoEntrega, setModoEntrega] = useState(null);

  async function localizarTienda() {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Tu navegador no soporta geolocalización.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const ubicacion = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setUbicacionCliente(ubicacion);

        const { data: sucursales, error } = await supabase
          .from("sucursales")
          .select("*");

        if (error) {
          console.error("Error cargando sucursales:", error);
          Swal.fire("Error", "Error al obtener sucursales.", "error");
          return;
        }

        if (!sucursales || sucursales.length === 0) {
          Swal.fire("Aviso", "No hay sucursales registradas.", "warning");
          return;
        }

        let menorDistancia = Infinity;
        let sucursalCercana = null;

        for (const suc of sucursales) {
          const d = distanciaMetros(
            ubicacion.lat,
            ubicacion.lon,
            suc.latitud,
            suc.longitud
          );

          if (d < menorDistancia) {
            menorDistancia = d;
            sucursalCercana = suc;
          }
        }

        setSucursalSeleccionada(sucursalCercana);
      },
      (err) => {
        console.error("Error geolocalización:", err);
        let mensaje = "";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            mensaje =
              "Permiso denegado. Por favor permite el acceso a tu ubicación.";
            break;
          case err.POSITION_UNAVAILABLE:
            mensaje = "Ubicación no disponible. Intenta nuevamente más tarde.";
            break;
          case err.TIMEOUT:
            mensaje = "Tiempo de espera agotado. Intenta nuevamente.";
            break;
          default:
            mensaje = "No se pudo obtener tu ubicación.";
        }

        Swal.fire("Error", mensaje, "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  async function finalizarPedido(datosCliente = null) {
    if (!sucursalSeleccionada) {
      Swal.fire("Error", "No hay sucursal seleccionada", "error");
      return false;
    }

    if (!modoEntrega) {
      Swal.fire("Error", "Selecciona retiro o delivery", "error");
      return false;
    }

    if (carrito.length === 0) {
      Swal.fire("Error", "El carrito está vacío", "error");
      return false;
    }

    if (!datosCliente?.nombre || !datosCliente?.telefono) {
      Swal.fire("Error", "Faltan datos del cliente", "error");
      return false;
    }

    try {
      const totalPedido = carrito.reduce((acc, item) => {
        let subtotal = item.precio * (item.cantidad || 1);

        if (item.extras && item.extras.length > 0) {
          const extrasTotal = item.extras.reduce(
            (sum, e) => sum + Number(e.precio),
            0
          );
          subtotal += extrasTotal * (item.cantidad || 1);
        }

        return acc + subtotal;
      }, 0);

      const pedidoBase = {
        sucursal_id: sucursalSeleccionada.id,
        modo_entrega: modoEntrega,
        estado: "pendiente",
        total: totalPedido,
        cliente_lat: ubicacionCliente?.lat || null,
        cliente_lon: ubicacionCliente?.lon || null,
        cliente_nombre: datosCliente.nombre,
        cliente_telefono: datosCliente.telefono,
      };

      if (modoEntrega === "domicilio") {
        pedidoBase.direccion_entrega = datosCliente.direccion;
        pedidoBase.referencias = datosCliente.referencias || null;
        pedidoBase.comentarios = datosCliente.comentarios || null;

        if (datosCliente.coordenadas) {
          pedidoBase.cliente_lat = datosCliente.coordenadas.lat;
          pedidoBase.cliente_lon = datosCliente.coordenadas.lon;
        }
      }

      console.log("📦 Insertando pedido:", pedidoBase);

      const { data: pedidoData, error: errorPedido } = await supabase
        .from("pedidos")
        .insert(pedidoBase)
        .select()
        .single();

      if (errorPedido) {
        console.error("❌ Error al insertar pedido:", errorPedido);
        throw errorPedido;
      }

      const pedidoId = pedidoData.id;

      const itemsInsert = carrito.map((item) => ({
        pedido_id: pedidoId,
        producto_id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad || 1,
        comentario: item.comentario || null,
      }));

      const { error: errorItems } = await supabase
        .from("pedido_items")
        .insert(itemsInsert);

      if (errorItems) {
        console.error("❌ Error al insertar items:", errorItems);
        throw errorItems;
      }

      vaciar();

      if (modoEntrega === "domicilio") {
        await Swal.fire({
          icon: "success",
          title: "Pedido confirmado",
          html: `
            Será entregado en:<br><b>${datosCliente.direccion}</b><br><br>
            Total: <b>$${totalPedido.toLocaleString()}</b><br><br>
            Te contactaremos al <b>${datosCliente.telefono}</b>
          `,
          confirmButtonText: "Aceptar",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Pedido confirmado",
          html: `
            Retira tu pedido en:<br><b>${sucursalSeleccionada.nombre}</b><br><br>
            Total: <b>$${totalPedido.toLocaleString()}</b><br><br>
            Te avisaremos al <b>${datosCliente.telefono}</b>
          `,
          confirmButtonText: "Aceptar",
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Error finalizando pedido:", err);
      Swal.fire(
        "Error",
        "Hubo un error al crear el pedido. Intenta nuevamente.",
        "error"
      );
      return false;
    }
  }

  return {
    ubicacionCliente,
    sucursalSeleccionada,
    modoEntrega,
    setModoEntrega,
    localizarTienda,
    finalizarPedido,
  };
}
