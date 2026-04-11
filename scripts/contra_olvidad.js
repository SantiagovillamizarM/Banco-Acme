document.addEventListener("DOMContentLoaded", function () {

  var formulario = document.getElementById("form-recuperar");
  var mensaje = document.getElementById("mensaje-error-loginR");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var cedula = document.getElementById("cedula-recuperar").value.trim();
    var correo = document.getElementById("correo-recuperar").value.trim();

    // Buscar el usuario en localStorage
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    var usuarioEncontrado = null;

    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].cedula === cedula && usuarios[i].correo === correo) {
        usuarioEncontrado = usuarios[i];
        break;
      }
    }

    if (!usuarioEncontrado) {
      mensaje.textContent = "No encontramos una cuenta con esos datos.";
      mensaje.style.display = "block";
      return;
    }

    // Guardar temporalmente qué usuario va a cambiar su contraseña
    localStorage.setItem("recuperar-cedula", cedula);
    window.location.href = "contrasena_olvidada2.html";
  });

});
