document.addEventListener("DOMContentLoaded", function () {

  
  var nombreLogueado = sessionStorage.getItem("usuarioLogueado");
  if (!nombreLogueado) {
    window.location.href = "formulario-de-acceso.html";
    return;
  }

  var usuario = null;

  
  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].primerNombre === nombreLogueado) {
      usuario = usuarios[i];
      break;
    }
  }

  
  if (!usuario) {
    fetch("../datos-admin.json")
      .then(function (res) { return res.json(); })
      .then(function (datos) {
        for (var i = 0; i < datos.usuarios.length; i++) {
          var u = datos.usuarios[i];
          if ((u.primerNombre || u.nombre) === nombreLogueado) {
            usuario = u;
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


  function iniciarDashboard() {

    
    if (usuario && !usuario.numeroCuenta) {
      usuario.numeroCuenta = "AC-" + Math.floor(1000000000 + Math.random() * 9000000000);
      guardarUsuario();
    }

    
    if (usuario && !usuario.fechaCreacion) {
      usuario.fechaCreacion = new Date().toLocaleDateString("es-CO");
      guardarUsuario();
    }

    
    if (usuario && usuario.saldo === undefined) {
      usuario.saldo = 0;
      guardarUsuario();
    }

    
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


  function guardarUsuario() {
    var todosLosUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (var i = 0; i < todosLosUsuarios.length; i++) {
      if (String(todosLosUsuarios[i].cedula) === String(usuario.cedula)) {
        todosLosUsuarios[i] = usuario;
        localStorage.setItem("usuarios", JSON.stringify(todosLosUsuarios));
        return;
      }
    }
  }


  function cargarDatosEnPantalla() {
    if (!usuario) return;

    var nombreCompleto = usuario.primerNombre + " " + usuario.apellidos;

    
    document.getElementById("valor-numero-cuenta").textContent = usuario.numeroCuenta;
    document.getElementById("valor-saldo").textContent = formatearDinero(usuario.saldo || 0);
    document.getElementById("valor-estado").textContent = "Activa";
    document.getElementById("valor-fecha-creacion").textContent = usuario.fechaCreacion;

    
    document.getElementById("valor-cuenta-consignar").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-consignar").textContent = nombreCompleto;

    
    document.getElementById("valor-cuenta-retirar").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-retirar").textContent = nombreCompleto;

    
    document.getElementById("valor-cuenta-servicio").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-servicio").textContent = nombreCompleto;

    
    document.getElementById("cert-nombre-usuario").textContent = nombreCompleto;
    document.getElementById("cert-cedula-usuario").textContent = usuario.cedula;
    document.getElementById("cert-numero-cuenta").textContent = usuario.numeroCuenta;
    document.getElementById("cert-fecha-creacion").textContent = usuario.fechaCreacion;
    document.getElementById("cert-fecha-expedicion").textContent = "Fecha de expedición: " + new Date().toLocaleDateString("es-CO");

    cargarTablaTransacciones();
  }


  function cargarTablaTransacciones() {
    var cuerpo = document.getElementById("cuerpo-transacciones");
    cuerpo.innerHTML = "";

    var transacciones = (usuario && usuario.transacciones) ? usuario.transacciones : [];

    if (transacciones.length === 0) {
      var filaVacia = document.createElement("tr");
      filaVacia.innerHTML = "<td colspan='5' style='text-align:center; color: rgba(255,255,255,0.3); padding: 24px;'>No hay transacciones registradas</td>";
      cuerpo.appendChild(filaVacia);
      return;
    }

    
    var ultimas = transacciones.slice().reverse().slice(0, 10);

    for (var i = 0; i < ultimas.length; i++) {
      var t = ultimas[i];
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


  function configurarMenu() {
    var botones = [
      { id: "btn-resumen",     seccion: "transacciones" },
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

    
    document.getElementById("btn-cerrar-sesion").addEventListener("click", function () {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "formulario-de-acceso.html";
    });
  }


  function mostrarSeccion(idSeccion) {
    var secciones = document.querySelectorAll(".seccion");
    for (var i = 0; i < secciones.length; i++) {
      secciones[i].classList.remove("visible");
    }
    var seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) seccionActiva.classList.add("visible");
  }


  function marcarActivo(idBoton) {
    var botones = document.querySelectorAll(".boton-menu");
    for (var i = 0; i < botones.length; i++) {
      botones[i].classList.remove("activo");
    }
    var botonActivo = document.getElementById(idBoton);
    if (botonActivo) botonActivo.classList.add("activo");
  }


  function configurarBotones() {

    
    document.getElementById("btn-hacer-consignar").addEventListener("click", function () {
      var monto = parseFloat(document.getElementById("monto-consignar").value);
      if (!monto || monto <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }

      usuario.saldo = (usuario.saldo || 0) + monto;
      var transaccion = registrarTransaccion("Consignación", "Consignación por canal electrónico", monto);
      guardarUsuario();

      document.getElementById("monto-consignar").value = "";
      cargarDatosEnPantalla();
      mostrarResumenTransaccion("consignar", transaccion);
    });

    
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
      var transaccion = registrarTransaccion("Retiro", "Retiro de dinero", monto);
      guardarUsuario();

      document.getElementById("monto-retirar").value = "";
      cargarDatosEnPantalla();
      mostrarResumenTransaccion("retirar", transaccion);
    });

    
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
      var transaccion = registrarTransaccion("Retiro", "Pago de servicio público " + servicio, valor);
      guardarUsuario();

      document.getElementById("tipo-servicio").value = "";
      document.getElementById("referencia-servicio").value = "";
      document.getElementById("valor-servicio").value = "";
      cargarDatosEnPantalla();
      mostrarResumenTransaccion("servicio", transaccion);
    });

    
    document.getElementById("btn-imprimir-transacciones").addEventListener("click", function () {
      window.print();
    });

    
    document.getElementById("btn-imprimir-consignar").addEventListener("click", function () {
      window.print();
    });

    
    document.getElementById("btn-imprimir-retirar").addEventListener("click", function () {
      window.print();
    });

    
    document.getElementById("btn-imprimir-servicio").addEventListener("click", function () {
      window.print();
    });

    
    document.getElementById("btn-imprimir-certificado").addEventListener("click", function () {
      window.print();
    });
  }


  function mostrarResumenTransaccion(tipo, transaccion) {
    var resumen = document.getElementById("resumen-" + tipo);
    document.getElementById("res-fecha-" + tipo).textContent = transaccion.fecha;
    document.getElementById("res-referencia-" + tipo).textContent = transaccion.referencia;
    document.getElementById("res-tipo-" + tipo).textContent = transaccion.tipo;
    document.getElementById("res-descripcion-" + tipo).textContent = transaccion.descripcion;
    document.getElementById("res-valor-" + tipo).textContent = formatearDinero(transaccion.valor);
    resumen.classList.add("visible-resumen");
  }


  function registrarTransaccion(tipo, descripcion, valor) {
    var nueva = {
      fecha: new Date().toLocaleDateString("es-CO"),
      referencia: "REF-" + Date.now(),
      tipo: tipo,
      descripcion: descripcion,
      valor: valor
    };
    usuario.transacciones.push(nueva);
    return nueva;
  }


  function formatearDinero(valor) {
    return "$ " + valor.toLocaleString("es-CO");
  }

});