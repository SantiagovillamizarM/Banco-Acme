document.addEventListener("DOMContentLoaded", function () {

  // --- 1. GUARDIA DE SESIÓN ---
  var nombreLogueado = sessionStorage.getItem("usuarioLogueado");
  if (!nombreLogueado) {
    window.location.href = "formulario-de-acceso.html";
    return;
  }

  // --- 2. BUSCAR USUARIO COMPLETO EN localStorage ---
  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  var usuario = null;

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].primerNombre === nombreLogueado) {
      usuario = usuarios[i];
      break;
    }
  }

  // Si no se encontró en localStorage, buscamos en el JSON del admin
  if (!usuario) {
    fetch("../datos-admin.json")
      .then(function (res) { return res.json(); })
      .then(function (datos) {
        for (var i = 0; i < datos.usuarios.length; i++) {
          if ((datos.usuarios[i].primerNombre || datos.usuarios[i].nombre) === nombreLogueado) {
            usuario = datos.usuarios[i];
            break;
          }
        }
        iniciarDashboard();
      })
      .catch(function () {
        iniciarDashboard();
      });
  } else {
    iniciarDashboard();
  }

  // --- 3. FUNCIÓN PRINCIPAL ---
  function iniciarDashboard() {

    // Generar número de cuenta si no tiene uno
    if (usuario && !usuario.numeroCuenta) {
      usuario.numeroCuenta = "AC-" + Math.floor(1000000000 + Math.random() * 9000000000);
      guardarUsuario();
    }

    // Generar fecha de creación si no tiene
    if (usuario && !usuario.fechaCreacion) {
      usuario.fechaCreacion = new Date().toLocaleDateString("es-CO");
      guardarUsuario();
    }

    // Crear lista de transacciones si no existe
    if (usuario && !usuario.transacciones) {
      usuario.transacciones = [];
      guardarUsuario();
    }

    cargarDatosEnPantalla();
    configurarMenu();
    configurarBotones();
    mostrarSeccion("resumenCuenta");
    marcarActivo("btn-resumen");
  }

  // --- 4. GUARDAR USUARIO EN localStorage ---
  function guardarUsuario() {
    var todosLosUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (var i = 0; i < todosLosUsuarios.length; i++) {
      if (todosLosUsuarios[i].cedula === usuario.cedula) {
        todosLosUsuarios[i] = usuario;
        localStorage.setItem("usuarios", JSON.stringify(todosLosUsuarios));
        return;
      }
    }
  }

  // --- 5. CARGAR DATOS DEL USUARIO EN LA PANTALLA ---
  function cargarDatosEnPantalla() {
    if (!usuario) return;

    var nombre = usuario.primerNombre + " " + usuario.apellidos;

    // Resumen
    document.getElementById("valor-numero-cuenta").textContent = usuario.numeroCuenta;
    document.getElementById("valor-saldo").textContent = formatearDinero(usuario.saldo || 0);
    document.getElementById("valor-estado").textContent = "Activa";
    document.getElementById("valor-fecha-creacion").textContent = usuario.fechaCreacion;

    // Consignar
    document.getElementById("valor-cuenta-consignar").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-consignar").textContent = nombre;

    // Retirar
    document.getElementById("valor-cuenta-retirar").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-retirar").textContent = nombre;

    // Servicios
    document.getElementById("valor-cuenta-servicio").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-servicio").textContent = nombre;

    // Certificado
    document.getElementById("valor-fecha-certificado").textContent = usuario.fechaCreacion;

    cargarTablaTransacciones();
  }

  // --- 6. CARGAR TABLA DE TRANSACCIONES ---
  function cargarTablaTransacciones() {
    var cuerpo = document.getElementById("cuerpo-transacciones");
    cuerpo.innerHTML = "";

    var transacciones = (usuario && usuario.transacciones) ? usuario.transacciones : [];

    if (transacciones.length === 0) {
      var fila = document.createElement("tr");
      fila.innerHTML = "<td colspan='5' style='text-align:center; color: rgba(255,255,255,0.3); padding: 24px;'>No hay transacciones registradas</td>";
      cuerpo.appendChild(fila);
      return;
    }

    // Mostrar las más recientes primero
    var copia = transacciones.slice().reverse();

    for (var i = 0; i < copia.length; i++) {
      var t = copia[i];
      var fila = document.createElement("tr");
      var colorValor = t.tipo === "Consignación" ? "rgba(100,255,150,0.85)" : "rgba(255,120,120,0.85)";
      var signo = t.tipo === "Consignación" ? "+" : "-";

      fila.innerHTML =
        "<td>" + t.fecha + "</td>" +
        "<td>" + t.referencia + "</td>" +
        "<td>" + t.tipo + "</td>" +
        "<td>" + t.descripcion + "</td>" +
        "<td style='color:" + colorValor + "; font-weight:700;'>" + signo + formatearDinero(t.valor) + "</td>";

      cuerpo.appendChild(fila);
    }
  }

  // --- 7. NAVEGACIÓN DEL MENÚ ---
  function configurarMenu() {
    var botones = [
      { id: "btn-resumen",     seccion: "resumenCuenta" },
      { id: "btn-consignar",   seccion: "consignar" },
      { id: "btn-retirar",     seccion: "retirar" },
      { id: "btn-servicios",   seccion: "servicio" },
      { id: "btn-certificado", seccion: "certificado" }
    ];

    for (var i = 0; i < botones.length; i++) {
      (function (boton) {
        var elemento = document.getElementById(boton.id);
        if (elemento) {
          elemento.addEventListener("click", function () {
            mostrarSeccion(boton.seccion);
            marcarActivo(boton.id);
          });
        }
      })(botones[i]);
    }

    // Cerrar sesión
    document.getElementById("btn-cerrar-sesion").addEventListener("click", function () {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "formulario-de-acceso.html";
    });
  }

  // Muestra solo la sección indicada y oculta las demás
  function mostrarSeccion(idSeccion) {
    var secciones = document.querySelectorAll(".seccion");
    for (var i = 0; i < secciones.length; i++) {
      secciones[i].classList.remove("visible");
    }
    var seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) seccionActiva.classList.add("visible");
  }

  // Resalta el botón activo en el menú
  function marcarActivo(idBoton) {
    var botones = document.querySelectorAll(".boton-menu");
    for (var i = 0; i < botones.length; i++) {
      botones[i].classList.remove("activo");
    }
    var botonActivo = document.getElementById(idBoton);
    if (botonActivo) botonActivo.classList.add("activo");
  }

  // --- 8. BOTONES DE OPERACIONES ---
  function configurarBotones() {

    // CONSIGNAR
    document.getElementById("btn-hacer-consignar").addEventListener("click", function () {
      var monto = parseFloat(document.getElementById("monto-consignar").value);
      if (!monto || monto <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }
      usuario.saldo = (usuario.saldo || 0) + monto;
      registrarTransaccion("Consignación", "Consignación electrónica", monto);
      guardarUsuario();
      document.getElementById("monto-consignar").value = "";
      cargarDatosEnPantalla();
      alert("Consignación exitosa por " + formatearDinero(monto));
    });

    // RETIRAR
    document.getElementById("btn-hacer-retirar").addEventListener("click", function () {
      var monto = parseFloat(document.getElementById("monto-retirar").value);
      if (!monto || monto <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }
      if (monto > (usuario.saldo || 0)) {
        alert("Saldo insuficiente.");
        return;
      }
      usuario.saldo = (usuario.saldo || 0) - monto;
      registrarTransaccion("Retiro", "Retiro de dinero", monto);
      guardarUsuario();
      document.getElementById("monto-retirar").value = "";
      cargarDatosEnPantalla();
      alert("Retiro exitoso por " + formatearDinero(monto));
    });

    // PAGAR SERVICIO
    document.getElementById("btn-pagar-servicio").addEventListener("click", function () {
      var servicio = document.getElementById("tipo-servicio").value;
      var referencia = document.getElementById("referencia-servicio").value.trim();
      var valor = parseFloat(document.getElementById("valor-servicio").value);

      if (!servicio || !referencia || !valor || valor <= 0) {
        alert("Completa todos los campos del servicio.");
        return;
      }
      if (valor > (usuario.saldo || 0)) {
        alert("Saldo insuficiente.");
        return;
      }
      usuario.saldo = (usuario.saldo || 0) - valor;
      registrarTransaccion("Servicio", "Pago " + servicio + " - Ref: " + referencia, valor);
      guardarUsuario();
      document.getElementById("tipo-servicio").value = "";
      document.getElementById("referencia-servicio").value = "";
      document.getElementById("valor-servicio").value = "";
      cargarDatosEnPantalla();
      alert("Pago de " + servicio + " exitoso por " + formatearDinero(valor));
    });

    // IMPRIMIR TRANSACCIONES
    document.getElementById("btn-imprimir-transacciones").addEventListener("click", function () {
      window.print();
    });

    // IMPRIMIR CERTIFICADO
    document.getElementById("btn-imprimir-certificado").addEventListener("click", function () {
      window.print();
    });
  }

  // --- 9. REGISTRAR UNA TRANSACCIÓN ---
  function registrarTransaccion(tipo, descripcion, valor) {
    var nueva = {
      fecha: new Date().toLocaleDateString("es-CO"),
      referencia: "REF-" + Date.now(),
      tipo: tipo,
      descripcion: descripcion,
      valor: valor
    };
    usuario.transacciones.push(nueva);
  }

  // --- 10. FORMATEAR DINERO ---
  function formatearDinero(valor) {
    return "$ " + valor.toLocaleString("es-CO");
  }

});
