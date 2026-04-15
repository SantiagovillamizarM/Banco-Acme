//Le dice al documento que espere a que todo el HTML esté listo antes de ejecutar lo que está adentro
document.addEventListener("DOMContentLoaded", function () {

  //se agarra del localStorage los datos temporales que se guardaron en la fase anterior del registro
  //el JSON.parse es para poder manejarlos como un objeto normal
  const datosTemp = JSON.parse(localStorage.getItem("registro-temp"));

  //si no hay datos temporales o no tienen cédula (osea que alguien entró directo sin pasar por la fase 1)
  //lo manda de vuelta al inicio del registro y para el proceso
  if (!datosTemp || !datosTemp.cedula) {
    window.location.href = "../Register_fase1.html";
    return;
  }

  //se agarra el formulario de esta fase
  const formulario = document.getElementById("form-fase1");

  //se crea un párrafo nuevo para mostrar los errores, se le pone estilo rojo pequeño
  //y se oculta por defecto hasta que haya algo que mostrar
  const mensajeError = document.createElement("p");
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.85rem";
  mensajeError.style.display = "none";

  //se añade ese párrafo de error al final del formulario
  formulario.appendChild(mensajeError);

  //se le añade el evento de envío al formulario
  formulario.addEventListener("submit", function (evento) {

    //para que no recargue la página sola al enviar
    evento.preventDefault();

    //se agarran todos los valores del formulario, el .trim() es para recortar espacios
    //de más que el usuario pueda haber dejado sin querer
    const primerNombre = document.getElementById("primer-nombre-fase1").value.trim();
    const segundoNombre = document.getElementById("segundo-nombre-fase1").value.trim();
    const apellidos = document.getElementById("apellidos-fase1").value.trim();
    const genero = document.getElementById("genero-fase1").value;
    const contrasena = document.getElementById("contrasena-fase1").value;
    const confirmarContrasena = document.getElementById("confirmar-contrasena-fase1").value;

    //si alguno de los campos obligatorios está vacío muestra el error y para el proceso
    //(el segundo nombre no es obligatorio por eso no está en esta validación)
    if (!primerNombre || !apellidos || !genero) {
      mensajeError.textContent = "Por favor completa todos los campos obligatorios.";
      mensajeError.style.display = "block";
      return;
    }

    //si las dos contraseñas no coinciden muestra el error y para
    if (contrasena !== confirmarContrasena) {
      mensajeError.textContent = "Las contraseñas no coinciden.";
      mensajeError.style.display = "block";
      return;
    }

    //si la contraseña tiene menos de 6 caracteres muestra el error y para
    if (contrasena.length < 6) {
      mensajeError.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensajeError.style.display = "block";
      return;
    }

    //se crea un objeto nuevo que combina los datos que ya estaban guardados (datosTemp)
    //con los nuevos datos que se acaban de llenar en esta fase
    //el Object.assign hace esa combinación sin borrar lo que ya había
    const datosActualizados = Object.assign({}, datosTemp, {
      primerNombre: primerNombre,
      segundoNombre: segundoNombre,
      apellidos: apellidos,
      genero: genero,
      contrasena: contrasena
    });

    //se guardan los datos actualizados de vuelta en el localStorage para usarlos en la siguiente fase
    localStorage.setItem("registro-temp", JSON.stringify(datosActualizados));

    //y se pasa a la fase 3 del registro
    window.location.href = "Register_fase3.html";
  });

});