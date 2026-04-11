document.addEventListener("DOMContentLoaded", function () {

  
  const datosTemp = JSON.parse(localStorage.getItem("registro-temp"));
  if (!datosTemp || !datosTemp.cedula) {
    window.location.href = "../Register_fase1.html";
    return;
  }

  const formulario = document.getElementById("form-fase1");
  const mensajeError = document.createElement("p");
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.85rem";
  mensajeError.style.display = "none";
  formulario.appendChild(mensajeError);

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const primerNombre = document.getElementById("primer-nombre-fase1").value.trim();
    const segundoNombre = document.getElementById("segundo-nombre-fase1").value.trim();
    const apellidos = document.getElementById("apellidos-fase1").value.trim();
    const genero = document.getElementById("genero-fase1").value;
    const contrasena = document.getElementById("contrasena-fase1").value;
    const confirmarContrasena = document.getElementById("confirmar-contrasena-fase1").value;

    
    if (!primerNombre || !apellidos || !genero) {
      mensajeError.textContent = "Por favor completa todos los campos obligatorios.";
      mensajeError.style.display = "block";
      return;
    }

    if (contrasena !== confirmarContrasena) {
      mensajeError.textContent = "Las contraseñas no coinciden.";
      mensajeError.style.display = "block";
      return;
    }

    if (contrasena.length < 6) {
      mensajeError.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensajeError.style.display = "block";
      return;
    }

    
    const datosActualizados = Object.assign({}, datosTemp, {
      primerNombre: primerNombre,
      segundoNombre: segundoNombre,
      apellidos: apellidos,
      genero: genero,
      contrasena: contrasena
    });

    localStorage.setItem("registro-temp", JSON.stringify(datosActualizados));
    window.location.href = "Register_fase3.html";

  });

});