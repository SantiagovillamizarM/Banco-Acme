document.addEventListener("DOMContentLoaded", function () {

  
  const datosTemp = JSON.parse(localStorage.getItem("registro-temp"));
  if (!datosTemp || !datosTemp.contrasena) {
    window.location.href = "../Register_fase1.html";
    return;
  }

  const formulario = document.getElementById("form-fase3");
  const mensajeError = document.createElement("p");
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.85rem";
  mensajeError.style.display = "none";
  formulario.appendChild(mensajeError);

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correo = document.getElementById("correo-fase3").value.trim();
    const telefono = document.getElementById("telefono-fase3").value.trim();
    const direccion = document.getElementById("direccion-fase3").value.trim();
    const ciudad = document.getElementById("ciudad-fase3").value.trim();

    
    if (!correo || !telefono || !direccion || !ciudad) {
      mensajeError.textContent = "Por favor completa todos los campos.";
      mensajeError.style.display = "block";
      return;
    }

    if (telefono.length !== 10) {
      mensajeError.textContent = "El teléfono debe tener 10 dígitos.";
      mensajeError.style.display = "block";
      return;
    }

    
    const usuarioCompleto = Object.assign({}, datosTemp, {
      correo: correo,
      telefono: telefono,
      direccion: direccion,
      ciudad: ciudad
    });

    
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuariosLocales.push(usuarioCompleto);
    localStorage.setItem("usuarios", JSON.stringify(usuariosLocales));

   
    localStorage.removeItem("registro-temp");

    
    sessionStorage.setItem("usuarioLogueado", usuarioCompleto.primerNombre);
    window.location.href = "../dashboard.html";

  });

});