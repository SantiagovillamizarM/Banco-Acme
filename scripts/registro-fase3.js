//Le dice al documento que espere a que todo el HTML esté listo antes de ejecutar lo que está adentro
document.addEventListener("DOMContentLoaded", function () {

  //se agarra del localStorage los datos temporales de las fases anteriores del registro
  const datosTemp = JSON.parse(localStorage.getItem("registro-temp"));

  //si no hay datos o no tienen contraseña (osea que no pasó por la fase 2)
  //lo manda de vuelta al inicio del registro y para el proceso
  if (!datosTemp || !datosTemp.contrasena) {
    window.location.href = "../Register_fase1.html";
    return;
  }

  //se agarra el formulario de esta fase
  const formulario = document.getElementById("form-fase3");

  //se crea el párrafo de errores, se le pone estilo rojo pequeño y se oculta por defecto
  const mensajeError = document.createElement("p");
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.85rem";
  mensajeError.style.display = "none";

  //se añade ese párrafo al final del formulario
  formulario.appendChild(mensajeError);

  //se le añade el evento de envío al formulario
  formulario.addEventListener("submit", function (evento) {

    //para que no recargue la página sola al enviar
    evento.preventDefault();

    //se agarran todos los valores del formulario recortando espacios de más con el .trim()
    const correo = document.getElementById("correo-fase3").value.trim();
    const telefono = document.getElementById("telefono-fase3").value.trim();
    const direccion = document.getElementById("direccion-fase3").value.trim();
    const ciudad = document.getElementById("ciudad-fase3").value.trim();

    //si algún campo está vacío muestra el error y para el proceso
    if (!correo || !telefono || !direccion || !ciudad) {
      mensajeError.textContent = "Por favor completa todos los campos.";
      mensajeError.style.display = "block";
      return;
    }

    //si el teléfono no tiene exactamente 10 dígitos muestra el error y para
    if (telefono.length !== 10) {
      mensajeError.textContent = "El teléfono debe tener 10 dígitos.";
      mensajeError.style.display = "block";
      return;
    }

    //se arma el objeto completo del usuario combinando todos los datos de las fases anteriores
    //con los nuevos datos de contacto que se acaban de llenar en esta fase
    const usuarioCompleto = Object.assign({}, datosTemp, {
      correo: correo,
      telefono: telefono,
      direccion: direccion,
      ciudad: ciudad
    });

    //se agarra la lista de usuarios que ya existen en el localStorage y se añade el nuevo usuario
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuariosLocales.push(usuarioCompleto);
    localStorage.setItem("usuarios", JSON.stringify(usuariosLocales));

    //se borran los datos temporales del registro porque ya no se necesitan, el usuario quedó guardado
    localStorage.removeItem("registro-temp");

    //se guarda el nombre del usuario en el sessionStorage para que quede logueado automáticamente
    //y se manda directo al dashboard sin necesidad de que inicie sesión aparte
    sessionStorage.setItem("usuarioLogueado", usuarioCompleto.primerNombre);
    window.location.href = "../dashboard.html";
  });

});