//Le dice al documento que espere a que todo el HTML esté listo antes de ejecutar lo que está adentro
document.addEventListener("DOMContentLoaded", function () {

  //se agarra el formulario de esta primera fase del registro
  const formulario = document.getElementById("form-registro");

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

    //se agarran el tipo de documento seleccionado y el número de cédula ingresado
    const tipoDoc = document.getElementById("seleccion-registro").value;
    const cedula = document.getElementById("cedula-registro").value;

    //si no seleccionó ningún tipo de documento muestra el error y para el proceso
    if (!tipoDoc) {
      mensajeError.textContent = "Selecciona un tipo de documento.";
      mensajeError.style.display = "block";
      return;
    }

    //si el número de documento tiene menos de 6 o más de 12 dígitos muestra el error y para
    if (cedula.length < 6 || cedula.length > 12) {
      mensajeError.textContent = "El documento debe tener entre 6 y 12 dígitos.";
      mensajeError.style.display = "block";
      return;
    }

    //se agarra la lista de usuarios guardados en el localStorage y se busca si ya existe
    //alguno con esa misma cédula y tipo de documento (el .find recorre la lista y devuelve
    //el primero que cumpla la condición, si no encuentra ninguno devuelve undefined)
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
    const yaExiste = usuariosLocales.find(function (usuario) {
      return usuario.cedula === cedula && usuario.tipoDoc === tipoDoc;
    });

    //si ya existe una cuenta con ese documento muestra el error y para
    if (yaExiste) {
      mensajeError.textContent = "Ya existe una cuenta con ese documento.";
      mensajeError.style.display = "block";
      return;
    }

    //si todo está bien se guardan el tipo de documento y la cédula en el localStorage de forma temporal
    //para que las siguientes fases del registro puedan usarlos
    localStorage.setItem("registro-temp", JSON.stringify({ tipoDoc: tipoDoc, cedula: cedula }));

    //y se pasa a la fase 2 del registro
    window.location.href = "Register_fase2.html";
  });

});