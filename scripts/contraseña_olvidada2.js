//Le dice al documento que espere a que todo el HTML esté listo antes de ejecutar lo que está adentro
document.addEventListener("DOMContentLoaded", function () {

  //se agarra del localStorage la cédula que se guardó en el paso anterior del proceso de recuperación
  let cedula = localStorage.getItem("recuperar-cedula");

  //si no hay cédula guardada (osea que alguien entró directo a esta página sin pasar por el paso anterior)
  //lo manda de vuelta al inicio de recuperación y para el proceso
  if (!cedula) {
    window.location.href = "contra_olvidada.html";
    return;
  }

  //se crea la variable "formulario" para agarrar el form de la nueva contraseña
  let formulario = document.getElementById("form-nueva-contrasena");

  //se crea la variable "mensaje" para el párrafo donde se muestran los errores
  let mensaje = document.getElementById("mensaje-error-recuperar");

  //se le añade el evento de envío al formulario
  formulario.addEventListener("submit", function (evento) {

    //para que no recargue la página sola al enviar
    evento.preventDefault();

    //se agarran los valores de los dos campos de contraseña
    let nueva = document.getElementById("contrasena-nueva").value;
    let confirmar = document.getElementById("contrasena-confirmar").value;

    //si la contraseña nueva tiene menos de 6 caracteres muestra el error y para el proceso
    if (nueva.length < 6) {
      mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensaje.style.display = "block";
      return;
    }

    //si las dos contraseñas no coinciden muestra el error y para el proceso
    if (nueva !== confirmar) {
      mensaje.textContent = "Las contraseñas no coinciden.";
      mensaje.style.display = "block";
      return;
    }

    //se agarra la lista completa de usuarios del localStorage para buscar al que se va a actualizar
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    //se recorre la lista buscando al usuario cuya cédula coincida con la guardada
    //(el String() es para que no haya compliques comparando números con texto)
    for (let i = 0; i < usuarios.length; i++) {
      if (String(usuarios[i].cedula) === String(cedula)) {

        //cuando lo encuentra le reemplaza la contraseña y para de buscar
        usuarios[i].contrasena = nueva;
        break;
      }
    }

    //se guarda la lista actualizada de vuelta en el localStorage con la nueva contraseña
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    //se borra la cédula temporal que se usó para el proceso de recuperación, ya no se necesita
    localStorage.removeItem("recuperar-cedula");

    alert("¡Contraseña actualizada correctamente!");

    //y se manda al login para que inicie sesión con su nueva contraseña
    window.location.href = "login.html";
  });

});