document.addEventListener("DOMContentLoaded", function () {

  var formulario = document.getElementById("form-recuperar");
  var mensaje = document.getElementById("mensaje-error-recuperar");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var cedula = document.getElementById("cedula-recuperar").value.trim();
    var correo = document.getElementById("correo-recuperar").value.trim();

    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    var usuarioEncontrado = null;

    for (var i = 0; i < usuarios.length; i++) {
      
      if (String(usuarios[i].cedula) === String(cedula) && usuarios[i].correo === correo) {
        usuarioEncontrado = usuarios[i];
        break;
      }
    }

    if (!usuarioEncontrado) {
      mensaje.textContent = "Usuario inexistente o datos incorrectos.";
      mensaje.style.display = "block";
      return;
    }

    mensaje.style.display = "none";
    localStorage.setItem("recuperar-cedula", cedula);
    window.location.href = "contraseña_olvidada2.html";

  });

});