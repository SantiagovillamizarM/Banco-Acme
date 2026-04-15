//Le dice al documento que espere a que todo el HTML esté listo antes de ejecutar lo que está adentro 
document.addEventListener("DOMContentLoaded", function () {

  //se crea la variable "nombreLogueado" para agarrar del sessionStorage (lo que se guarda mientras la pestaña está abierta)
  //el nombre del usuario que inició sesión
  let nombreLogueado = sessionStorage.getItem("usuarioLogueado");

  //si no hay nadie logueado (osea que "nombreLogueado" está vacío) lo manda de vuelta al formulario de acceso
  //y para el proceso con el return para que no siga ejecutando lo de abajo
  if (!nombreLogueado) {
    window.location.href = "formulario-de-acceso.html";
    return;
  }

  //se crea "usuario" con null para usarlo como indicador, si al final sigue en null es que no se encontró 
  let usuario = null;

  //se busca en el localStorage (lo guardado en el PC) la lista de usuarios, el JSON.parse es para manejarlo
  //como una lista normal y el || [] es para que no de error si no hay nada guardado todavía
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  //se recorre toda la lista de usuarios uno por uno
  for (let i = 0; i < usuarios.length; i++) {

    //si el primerNombre del usuario que estamos revisando es igual al que está logueado...
    if (usuarios[i].primerNombre === nombreLogueado) {

      //guardamos ese usuario encontrado y paramos de buscar :D
      usuario = usuarios[i];
      break;
    }
  }

  //si después de buscar en el localStorage "usuario" sigue siendo null (osea no se encontró ahí)
  //entonces va a buscar en el archivo datos-admin.json (para el caso de los admins) (el admin solo fue agregado como una prueba
  //no tiene nada de especial o importante)
  if (!usuario) {
    //fetch es para ver lo que esta en ese json en especifico
    fetch("../datos-admin.json")
      .then(function (res) { return res.json(); })
      .then(function (datos) {

        //recorre la lista de usuarios del JSON buscando el que coincida con el logueado
        for (let i = 0; i < datos.usuarios.length; i++) {
          let u = datos.usuarios[i];

          //revisa tanto "primerNombre" como "nombre" porque el admin puede tener cualquiera de los dos
          if ((u.primerNombre || u.nombre) === nombreLogueado) {
            usuario = u;
            break;
          }
        }
        //cuando termine de buscar (lo encuentre o no) arranca el dashboard
        iniciarDashboard();
      })
      .catch(function () {
        //si falla la carga del JSON arranca el dashboard igual, para que no se quede congelado
        iniciarDashboard();
      });
  } else {
    //si ya se encontró en el localStorage arranca el dashboard directamente sin buscar en el JSON
    iniciarDashboard();
  }


  function iniciarDashboard() {

    //si el usuario no tiene número de cuenta le genera uno automáticamente
    //el "AC-" es el prefijo y lo que sigue es un número random de 10 dígitos :D
    if (usuario && !usuario.numeroCuenta) {
      usuario.numeroCuenta = "AC-" + Math.floor(1000000000 + Math.random() * 9000000000);
      guardarUsuario();
    }

    //si el usuario no tiene fecha de creación registrada le pone la de hoy (colombia) (día/mes/año)
    if (usuario && !usuario.fechaCreacion) {
      usuario.fechaCreacion = new Date().toLocaleDateString("es-CO");
      guardarUsuario();
    }

    //si el usuario no tiene saldo definido (undefined) le pone 0 para que no aparezca vacío
    if (usuario && usuario.saldo === undefined) {
      usuario.saldo = 0;
      guardarUsuario();
    }

    //si el usuario no tiene lista de transacciones le crea una vacía para que no se dañe más adelante 
    if (usuario && !usuario.transacciones) {
      usuario.transacciones = [];
      guardarUsuario();
    }

    //estas cuatro funciones arrancan todo lo visual y funcional del dashboard
    cargarDatosEnPantalla();
    configurarMenu();
    configurarBotones();
    mostrarSeccion("resumenCuenta");
    marcarActivo("btn-resumen");
  }


  function guardarUsuario() {

    //se agarra la lista completa de usuarios del localStorage
    let todosLosUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    //se recorre la lista buscando al usuario actual por su cédula (con String() para que no haya problemas)
    for (let i = 0; i < todosLosUsuarios.length; i++) {
      if (String(todosLosUsuarios[i].cedula) === String(usuario.cedula)) {

        //cuando lo encuentra lo reemplaza con los datos actualizados y guarda todo de vuelta
        todosLosUsuarios[i] = usuario;
        localStorage.setItem("usuarios", JSON.stringify(todosLosUsuarios));
        return;
      }
    }
  }


  function cargarDatosEnPantalla() {

    //si por alguna razón no hay usuario simplemente no hace nada y para
    if (!usuario) return;

    //se arma el nombre completo uniendo el primerNombre y los apellidos con un espacio en el medio
    let nombreCompleto = usuario.primerNombre + " " + usuario.apellidos;

    //se ponen los datos del resumen de cuenta en los elementos del HTML correspondientes
    document.getElementById("valor-numero-cuenta").textContent = usuario.numeroCuenta;
    document.getElementById("valor-saldo").textContent = formatearDinero(usuario.saldo || 0);
    document.getElementById("valor-estado").textContent = "Activa";
    document.getElementById("valor-fecha-creacion").textContent = usuario.fechaCreacion;

    //se ponen los datos en la sección de consignar
    document.getElementById("valor-cuenta-consignar").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-consignar").textContent = nombreCompleto;

    //se ponen los datos en la sección de retirar
    document.getElementById("valor-cuenta-retirar").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-retirar").textContent = nombreCompleto;

    //se ponen los datos en la sección de servicios
    document.getElementById("valor-cuenta-servicio").textContent = usuario.numeroCuenta;
    document.getElementById("valor-nombre-servicio").textContent = nombreCompleto;

    //se ponen los datos en el certificado bancario
    document.getElementById("cert-nombre-usuario").textContent = nombreCompleto;
    document.getElementById("cert-cedula-usuario").textContent = usuario.cedula;
    document.getElementById("cert-numero-cuenta").textContent = usuario.numeroCuenta;
    document.getElementById("cert-fecha-creacion").textContent = usuario.fechaCreacion;
    document.getElementById("cert-fecha-expedicion").textContent = "Fecha de expedición: " + new Date().toLocaleDateString("es-CO");

    //por último carga la tabla de transacciones con los movimientos del usuario
    cargarTablaTransacciones();
  }


  function cargarTablaTransacciones() {

    //se agarra el cuerpo de la tabla y se limpia para poner datos frescos
    let cuerpo = document.getElementById("cuerpo-transacciones");
    cuerpo.innerHTML = "";

    //se agarra la lista de transacciones del usuario, si no tiene ninguna se usa una lista vacía
    let transacciones = (usuario && usuario.transacciones) ? usuario.transacciones : [];

    //si no hay transacciones se pone un mensaje en la tabla avisando que no hay nada todavía
    if (transacciones.length === 0) {
      let filaVacia = document.createElement("tr");
      filaVacia.innerHTML = "<td colspan='5' style='text-align:center; color: rgba(255,255,255,0.3); padding: 24px;'>No hay transacciones registradas</td>";
      cuerpo.appendChild(filaVacia);
      return;
    }

    //se invierten las transacciones para que las más recientes salgan primero (.reverse())
    //y se toman solo las últimas 10 para no llenar la tabla :D
    let ultimas = transacciones.slice().reverse().slice(0, 10);

    //se recorren esas últimas transacciones y se crea una fila en la tabla por cada una
    for (let i = 0; i < ultimas.length; i++) {
      let t = ultimas[i];
      let fila = document.createElement("tr");

      //si es consignación el valor se muestra en verde, si es retiro en rojo :D
      let colorValor = t.tipo === "Consignación" ? "rgba(100,255,150,0.85)" : "rgba(255,120,120,0.85)";

      //el signo + para consignaciones y - para retiros
      let signo = t.tipo === "Consignación" ? "+" : "-";

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

    //se crea la lista de botones del menú, cada uno con su id y la sección que debe mostrar al hacer clic
    const botones = [
      { id: "btn-resumen",     seccion: "transacciones" },
      { id: "btn-consignar",   seccion: "consignar" },
      { id: "btn-retirar",     seccion: "retirar" },
      { id: "btn-servicios",   seccion: "servicio" },
      { id: "btn-certificado", seccion: "certificado" }
    ];

    //se recorre la lista y a cada botón se le añade el evento de clic
    //(el function(boton) de afuera es para que cada botón recuerde su propia sección y no se molesten entre si)
    for (let i = 0; i < botones.length; i++) {
      (function (boton) {
        let elemento = document.getElementById(boton.id);
        if (elemento) {
          elemento.addEventListener("click", function () {
            mostrarSeccion(boton.seccion);
            marcarActivo(boton.id);
          });
        }
      })(botones[i]);
    }

    //al botón de cerrar sesión se le dice que borre al usuario del sessionStorage y mande al login
    document.getElementById("btn-cerrar-sesion").addEventListener("click", function () {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "formulario-de-acceso.html";
    });
  }


  function mostrarSeccion(idSeccion) {

    //se agarran todas las secciones y se les quita la clase "visible" para ocultarlas todas
    let secciones = document.querySelectorAll(".seccion");
    for (let i = 0; i < secciones.length; i++) {
      secciones[i].classList.remove("visible");
    }

    //y solo a la sección que se pidió se le añade "visible" para mostrarla :D
    let seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) seccionActiva.classList.add("visible");
  }


  function marcarActivo(idBoton) {

    //se agarran todos los botones del menú y se les quita la clase "activo"
    let botones = document.querySelectorAll(".boton-menu");
    for (let i = 0; i < botones.length; i++) {
      botones[i].classList.remove("activo");
    }

    //y solo al botón que se presionó se le pone "activo" para que se vea seleccionado :D
    let botonActivo = document.getElementById(idBoton);
    if (botonActivo) botonActivo.classList.add("activo");
  }


  function configurarBotones() {

    //botón de consignar: agarra el monto, valida que sea un número positivo,
    //le suma al saldo, registra la transacción y recarga los datos en pantalla
    document.getElementById("btn-hacer-consignar").addEventListener("click", function () {
      let monto = parseFloat(document.getElementById("monto-consignar").value);
      if (!monto || monto <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }

      usuario.saldo = (usuario.saldo || 0) + monto;
      let transaccion = registrarTransaccion("Consignación", "Consignación por canal electrónico", monto);
      guardarUsuario();

      document.getElementById("monto-consignar").value = "";
      cargarDatosEnPantalla();
      mostrarResumenTransaccion("consignar", transaccion);
    });

    //botón de retirar: igual que el de consignar pero le resta al saldo
    //y revisa primero que haya saldo suficiente para no dejarlo en negativo :D
    document.getElementById("btn-hacer-retirar").addEventListener("click", function () {
      let monto = parseFloat(document.getElementById("monto-retirar").value);
      if (!monto || monto <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }
      if (monto > (usuario.saldo || 0)) {
        alert("Saldo insuficiente.");
        return;
      }

      usuario.saldo = (usuario.saldo || 0) - monto;
      let transaccion = registrarTransaccion("Retiro", "Retiro de dinero", monto);
      guardarUsuario();

      document.getElementById("monto-retirar").value = "";
      cargarDatosEnPantalla();
      mostrarResumenTransaccion("retirar", transaccion);
    });

    //botón de pagar servicio: agarra el tipo de servicio, la referencia y el valor,
    //valida que todos estén llenos y que haya saldo, y si todo está bien descuenta y registra :D
    document.getElementById("btn-pagar-servicio").addEventListener("click", function () {
      let servicio = document.getElementById("tipo-servicio").value;
      let referencia = document.getElementById("referencia-servicio").value.trim();
      let valor = parseFloat(document.getElementById("valor-servicio").value);

      if (!servicio || !referencia || !valor || valor <= 0) {
        alert("Completa todos los campos del servicio.");
        return;
      }
      if (valor > (usuario.saldo || 0)) {
        alert("Saldo insuficiente.");
        return;
      }

      usuario.saldo = (usuario.saldo || 0) - valor;
      let transaccion = registrarTransaccion("Retiro", "Pago de servicio público " + servicio, valor);
      guardarUsuario();

      document.getElementById("tipo-servicio").value = "";
      document.getElementById("referencia-servicio").value = "";
      document.getElementById("valor-servicio").value = "";
      cargarDatosEnPantalla();
      mostrarResumenTransaccion("servicio", transaccion);
    });

    //estos botones simplemente llaman al window.print() para imprimir o guardar como PDF lo que se vea en pantalla
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

    //se agarra el div del resumen según el tipo (consignar, retirar o servicio)
    //y se llenan todos sus campos con los datos de la transacción que se acaba de hacer 
    let resumen = document.getElementById("resumen-" + tipo);
    document.getElementById("res-fecha-" + tipo).textContent = transaccion.fecha;
    document.getElementById("res-referencia-" + tipo).textContent = transaccion.referencia;
    document.getElementById("res-tipo-" + tipo).textContent = transaccion.tipo;
    document.getElementById("res-descripcion-" + tipo).textContent = transaccion.descripcion;
    document.getElementById("res-valor-" + tipo).textContent = formatearDinero(transaccion.valor);
    resumen.classList.add("visible-resumen");
  }


  function registrarTransaccion(tipo, descripcion, valor) {

    //se crea el objeto de la nueva transacción con la fecha de hoy, una referencia única basada en
    //la hora exacta (Date.now() nunca se repite), el tipo, descripción y valor
    let nueva = {
      fecha: new Date().toLocaleDateString("es-CO"),
      referencia: "REF-" + Date.now(),
      tipo: tipo,
      descripcion: descripcion,
      valor: valor
    };

    //se añade a la lista de transacciones del usuario y se devuelve para poder mostrarla en el resumen
    usuario.transacciones.push(nueva);
    return nueva;
  }


  function formatearDinero(valor) {
    //convierte el número a formato de dinero colombiano (con puntos de miles) y le pone el signo $ adelante :D
    return "$ " + valor.toLocaleString("es-CO");
  }

});