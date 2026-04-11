document.addEventListener("DOMContentLoaded", function () {


  if (!sessionStorage.getItem("usuarioLogueado")) {
    window.location.href = "login.html";
    return;
  }


  const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");

  botonCerrarSesion.addEventListener("click", function () {
    sessionStorage.removeItem("usuarioLogueado");
    window.location.href = "formulario-de-acceso.html";
  });

});