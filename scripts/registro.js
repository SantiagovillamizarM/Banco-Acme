document.addEventListener("DOMContentLoaded", function () {

  const formulario = document.getElementById("form-registro");
  const mensajeError = document.createElement("p");
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.85rem";
  mensajeError.style.display = "none";
  formulario.appendChild(mensajeError);

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipoDoc = document.getElementById("seleccion-registro").value;
    const cedula = document.getElementById("cedula-registro").value;

    
    if (!tipoDoc) {
      mensajeError.textContent = "Selecciona un tipo de documento.";
      mensajeError.style.display = "block";
      return;
    }

    if (cedula.length < 6 || cedula.length > 12) {
      mensajeError.textContent = "El documento debe tener entre 6 y 12 dígitos.";
      mensajeError.style.display = "block";
      return;
    }

    // Verificar que no exista ya ese usuario en localStorage
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
    const yaExiste = usuariosLocales.find(function (usuario) {
      return usuario.cedula === cedula && usuario.tipoDoc === tipoDoc;
    });

    if (yaExiste) {
      mensajeError.textContent = "Ya existe una cuenta con ese documento.";
      mensajeError.style.display = "block";
      return;
    }

    
    localStorage.setItem("registro-temp", JSON.stringify({ tipoDoc: tipoDoc, cedula: cedula }));
    window.location.href = "Register_fase2.html";

  });

});