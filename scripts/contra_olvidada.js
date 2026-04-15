
//Le dice al documento (document) que añada un evento (.addEventListener) el cual trate en que espere a que la estructura HTML este lista 
//para ejecutarse sin necesidad de esperar a cargas por aparte (DOMContentLoaded) y despues el function () (actua como contenedor de instrucciones)
//hace que cuando lo primero se cumpl se ejecute lo que esta dentro del el (osea las ordenes)
document.addEventListener("DOMContentLoaded", function () {


  //se crea una variable llamada "formulario" para lo que se obtenga del apartado  de form-recuperar (osea documento y correo electronico)
  let formulario = document.getElementById("form-recuperar");

  //se crea una variable llamada "mensaje" para el mensaje de error (el p vacio)
  let mensaje = document.getElementById("mensaje-error-recuperar");


  //ahora se le dice que a "formulario" se le añada un nuevo evento, cuando se suba (submit) pase el paramentro "evento"
  formulario.addEventListener("submit", function (evento) {

    //este parametro lo que hace es que no se actualice la pagina por si sola
    evento.preventDefault();


    //se crea una variable llamada "cedula" la cual su valor va a ser el asignado en "cedula-recuperar" y le dice  que el contenido
    // que este adentro (.value) sea modificado para que no tenga espacios (.trim())
    let cedula = document.getElementById("cedula-recuperar").value.trim();

    //se crea una variable llamada "correo" para el correo infresado con el .value.trim() para que si hay espacios los recorte igual
    //que en el anterior
    let correo = document.getElementById("correo-recuperar").value.trim();
  
    // se crea la variable usuario para que el localStorage (lo guardado dentro del PC que se esta usando) busque si ya existe algo
    //guardado bajo el nombre de "usuarios", el JSON.parse es para que se pueda manejar esa informacion mas facilmente como una lista
    //y el final es para que no salte error si no hay nada guardado todavia :D
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // se crea la variable "usuarioEncontrado" con valor "null" para que sirva como indicador (si existe o no el usuario)
    let usuarioEncontrado = null;

    //Se crea un for el cual lo primero que hace es crear la variable i y su valor es asignado a 0, despues dice si 
    //i es mas pequeño que usuario.lenght (se usa para ver cuantos usuarios hay), sumar 1 a la variable i
    for (let i = 0; i < usuarios.length; i++) {
      

      //se crea un if que dice que si la cedula y el correo del usuario son iguales (se usa String para que los tome como texto 
      //para que no se arme un caos :D)...
      if (String(usuarios[i].cedula) === String(cedula) && usuarios[i].correo === correo) { //(usuarios[i].cedula es para tomar ese numero especifico de usuario que estamos buscando y no busque otro no deseado)
        
        //Para que pase esto :D, que diga que el usuario encontrado es igual al usuario ya guardado
        usuarioEncontrado = usuarios[i];

        //y que lleguee hasta aca
        break;
      }
    }

    //Se crea un if que dice que si el usuario NO fue encontrado (por eso el "!" eso es lo que representa)
    if (!usuarioEncontrado) {

      //y que si no se encontro ponga en el mensaje del p sin nada este mensaje 
      mensaje.textContent = "Usuario inexistente o datos incorrectos.";

      //y para que ponga este style
      mensaje.style.display = "block";

      //y aca se termina el proceso para que se vuelva a realizar
      return;
    }

    //es para que el mensaje se borre si ya lo puso todo bien :D
    mensaje.style.display = "none";

    //aca el localstorage lo que le dice con el .setitem es que la informacion de la cedula la guarde en "recuperar-cedula"
    localStorage.setItem("recuperar-cedula", cedula);

    //y esto es simplemente para que pase al siguiente paso
    window.location.href = "contraseña_olvidada2.html";
  });

});