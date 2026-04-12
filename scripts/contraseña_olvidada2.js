document.addEventListener("DOMContentLoaded", function () {

  var cedula = localStorage.getItem("recuperar-cedula");
  if (!cedula) {
    window.location.href = "contra_olvidada.html";
    return;
  }

  var formulario = document.getElementById("form-nueva-contrasena");
  var mensaje = document.getElementById("mensaje-error-recuperar");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nueva = document.getElementById("contrasena-nueva").value;
    var confirmar = document.getElementById("contrasena-confirmar").value;

    if (nueva.length < 6) {
      mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensaje.style.display = "block";
      return;
    }

    if (nueva !== confirmar) {
      mensaje.textContent = "Las contraseñas no coinciden.";
      mensaje.style.display = "block";
      return;
    }

    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (var i = 0; i < usuarios.length; i++) {
      if (String(usuarios[i].cedula) === String(cedula)) {
        usuarios[i].contrasena = nueva;
        break;
      }
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.removeItem("recuperar-cedula");

    alert("¡Contraseña actualizada correctamente!");
    window.location.href = "login.html";
  });

});