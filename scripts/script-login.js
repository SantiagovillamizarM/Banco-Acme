document.addEventListener("DOMContentLoaded", function () {

  // Si ya esta logueado, va directo al dashboard
  if (sessionStorage.getItem("usuarioLogueado")) {
    window.location.href = "dashboard.html";
    return;
  }

  const formulario = document.getElementById("form-loginR");
  const mensajeError = document.getElementById("mensaje-error-loginR");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipoDocSeleccionado = document.getElementById("seleccion-loginR").value;
    const cedulaIngresada = document.getElementById("cedula-loginR").value;
    const correoIngresado = document.getElementById("correo-loginR").value;
    const contrasenaIngresada = document.getElementById("contraseña-loginR").value;

    fetch("../datos-admin.json")
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function (datos) {

        const usuariosJson = datos.usuarios;

        // Busca en el JSON (el admin)
        const adminEncontrado = usuariosJson.find(function (usuario) {
          return (
            usuario.tipoDoc === tipoDocSeleccionado &&
            usuario.cedula === cedulaIngresada &&
            usuario.correo === correoIngresado &&
            usuario.contrasena === contrasenaIngresada
          );
        });

        // Busca en localStorage (usuarios registrados)
        const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioLocalEncontrado = usuariosLocales.find(function (usuario) {
          return (
            usuario.tipoDoc === tipoDocSeleccionado &&
            usuario.cedula === cedulaIngresada &&
            usuario.correo === correoIngresado &&
            usuario.contrasena === contrasenaIngresada
          );
        });

        const usuarioEncontrado = adminEncontrado || usuarioLocalEncontrado;

        if (usuarioEncontrado) {
          mensajeError.style.display = "none";
          sessionStorage.setItem("usuarioLogueado", usuarioEncontrado.primerNombre || usuarioEncontrado.nombre);
          window.location.href = "dashboard.html";
        } else {
          mensajeError.textContent = "Datos incorrectos o inexistentes.";
          mensajeError.style.display = "block";
        }

      })
      .catch(function (error) {
        console.error("Error al leer los datos:", error);
        alert("Hubo un problema al verificar los datos.");
      });

  });

});