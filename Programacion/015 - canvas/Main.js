// addEventListener es la función de la mayoría de los elementos de HTML, en particular window corresponde a la ventana del navegador, porque lo que en siguiente línea se esta agregando un manejador de eventos que se ejecuta cuando el documento termine de cargarse ("load")
// Esto es necesario ya que queremos acceder al elemento canvas pero como la ejecución se realiza de arriba a abajo, este código JavaScript se ejecuta antes que la creación del canvas, entonces hay que esperar a que el documento se cargue y luego acceder a sus elementos

// La función addEventListener recibe dos parámetros, el primero es el nombre del evento que se va a manejar, y el segundo es una función la cual se ejecuta cuando se lanza el evento
window.addEventListener("load", function(evt) {
  // La variable document es una variable global del navegador que nos da acceso al documento HTML
  // La función getElementById es una función que busca un elemento con el identificador pasado como argumento y si lo encuentra devuelve una referencia a dicho elemento
  let canvas = document.getElementById("the_canvas");
  console.log(canvas);

  // Los elementos de tipo canvas proporcionan la función getContext con la que se puede tener acceso al contexto de dibujado del elemento, este contexto contiene todas las funciones que se pueden utilizar para dibujar en el canvas
  let context = canvas.getContext("2d");
  console.log(context);
});