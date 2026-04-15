//Le dice al documento que espere a que toda la estructura HTML este lista antes de ejecutar lo que esta adentro
document.addEventListener("DOMContentLoaded", function () {

  //esto lo que hace es revisar si en el sessionStorage (la memoria temporal del navegador mientras la pestaña este abierta)
  //ya hay algo guardado bajo el nombre "usuarioLogueado", si ya hay algo es porque la persona ya inicio sesion
  //y no tiene sentido que vuelva a ver el login, entonces lo manda directo al dashboard
  if (sessionStorage.getItem("usuarioLogueado")) {
    window.location.href = "dashboard.html";

    //y aca corta todo para que no siga ejecutando lo de abajo innecesariamente
    return;
  }

  //se crea la variable "formulario" para agarrar el form del login
  const formulario = document.getElementById("form-loginR");

  //se crea la variable "mensajeError" para el parrafo donde se va a mostrar el error si algo sale mal
  const mensajeError = document.getElementById("mensaje-error-loginR");

  //se le dice al formulario que cuando se intente enviar (submit) ejecute lo que esta adentro pasandole el parametro "evento"
  formulario.addEventListener("submit", function (evento) {

    //esto es para que la pagina no se recargue sola cuando se le de al boton de enviar
    evento.preventDefault();

    //estas cuatro variables agarran lo que el usuario escribio o selecciono en cada campo del formulario
    //el .value es para obtener lo que hay adentro y en los de texto el .trim() recorta los espacios de sobra
    const tipoDocSeleccionado = document.getElementById("seleccion-loginR").value;
    const cedulaIngresada = document.getElementById("cedula-loginR").value;
    const correoIngresado = document.getElementById("correo-loginR").value;
    const contrasenaIngresada = document.getElementById("contraseña-loginR").value;

    //aca se hace un fetch (osea una peticion) para ir a buscar el archivo JSON donde estan los admins guardados
    fetch("../datos-admin.json")

      //cuando llegue la respuesta (.then es "cuando esto pase, hace esto") se convierte a formato JSON
      //para que se pueda manejar como una lista normal :D
      .then(function (respuesta) {
        return respuesta.json();
      })

      //cuando ya este convertido, se ejecuta lo de adentro con los datos listos para usar
      .then(function (datos) {

        //se crea la variable "usuariosJson" para agarrar la lista de usuarios que viene del JSON
        const usuariosJson = datos.usuarios;

        //se busca dentro del JSON si existe algun usuario que tenga exactamente los mismos datos que ingreso la persona
        //el .find() recorre la lista y devuelve el primero que cumpla todas las condiciones, si no encuentra ninguno devuelve undefined
        const adminEncontrado = usuariosJson.find(function (usuario) {
          return (
            usuario.tipoDoc === tipoDocSeleccionado &&
            usuario.cedula === cedulaIngresada &&
            usuario.correo === correoIngresado &&
            usuario.contrasena === contrasenaIngresada
          );
        });

        //lo mismo de arriba pero ahora buscando en el localStorage (los usuarios que se registraron desde la app)
        //el JSON.parse es para convertir lo guardado en algo manejable, y el || [] es por si no hay nada guardado todavia :D
        const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioLocalEncontrado = usuariosLocales.find(function (usuario) {
          return (
            usuario.tipoDoc === tipoDocSeleccionado &&
            usuario.cedula === cedulaIngresada &&
            usuario.correo === correoIngresado &&
            usuario.contrasena === contrasenaIngresada
          );
        });

        //aca se crea la variable "usuarioEncontrado" que va a tomar lo que haya encontrado, ya sea del JSON o del localStorage
        //el "||" significa "o", osea si adminEncontrado no encontro nada entonces que use usuarioLocalEncontrado
        const usuarioEncontrado = adminEncontrado || usuarioLocalEncontrado;

        //si se encontro un usuario que coincida con todo lo ingresado...
        if (usuarioEncontrado) {

          //se esconde el mensaje de error por si estaba visible de un intento anterior
          mensajeError.style.display = "none";

          //se guarda en el sessionStorage el nombre del usuario para saber que ya inicio sesion
          //el || es por si el usuario viene del JSON (primerNombre) o del localStorage (nombre), para que no quede vacio :D
          sessionStorage.setItem("usuarioLogueado", usuarioEncontrado.primerNombre || usuarioEncontrado.nombre);

          //y lo manda al dashboard
          window.location.href = "dashboard.html";

        } else {

          //si no se encontro nada que coincida, muestra el mensaje de error
          mensajeError.textContent = "Datos incorrectos o inexistentes.";
          mensajeError.style.display = "block";
        }

      })

      //si hubo algun problema al hacer el fetch (por ejemplo que no encontro el archivo) cae aca
      //el console.error es para ver el error en la consola del navegador y el alert es para avisarle al usuario
      .catch(function (error) {
        console.error("Error al leer los datos:", error);
        alert("Hubo un problema al verificar los datos.");
      });

  });

});