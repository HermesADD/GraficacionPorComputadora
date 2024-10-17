window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // Los caminos (o Paths) son los objetos gráficos más flexibles que proporciona el canvas

  // Podemos pensar que la forma de dibujar en el canvas se realiza por medio de una pluma sobre una hoja de papel; donde podemos hacer que la pluma se mueva a una posición sin dibujar nada (función moveTo) o que se mueva desde su última posición a una nueva posición dibujando a su paso (función lineTo)

  // la función beginPath() en esencia almacena un conjunto de comandos de dibujado, para posteriormente ejecutar una función que dibuja dichos comandos
  context.beginPath();
  context.lineWidth = 5;

  // En el ciclo se mueve la pluma a la posición (10,y) sin dibujar nada
  // Luego desde la última posición de la pluma (en este caso (10,y)) la pluma se mueve a la posición (500,y) pero esta vez dibujando la línea a su paso
  for (let y = 10; y < 300; y += 10) {
    context.moveTo(10, y);
    context.lineTo(500, y);
  }
  // Todos los comandos anteriores se almacenan en el último camino activo, antes de este momento no se ha dibujado nada
  // La función stroke() toma la información de los comandos de dibujado y ahora sí los utiliza para dibujar el camino
  context.stroke();

  // Se crea un nuevo camino el cual reemplaza los comandos anteriores y registra nuevos comandos
  context.beginPath();
  context.fillStyle = "rgba(0, 30, 200, 0.75)";
  context.moveTo(50, 410);
  context.lineTo(10, 470);
  context.lineTo(90, 470);
  // Los comandos del último camino se usan para dibujar un camino relleno, en este caso un triángulo cuyo interior es de color: rgba(0, 30, 200, 0.75)
  context.fill();

  // Se crea un camino más
  context.beginPath();
  context.strokeStyle = "rgba(210, 30, 10, 0.75)";
  context.moveTo(150, 410);
  context.lineTo(110, 470);
  context.lineTo(190, 470);
  // Se dibuja el camino
  context.stroke();
  
  // El último camino
  context.beginPath();
  context.strokeStyle = "rgba(60, 180, 10, 0.75)";
  context.moveTo(250, 410);
  context.lineTo(210, 470);
  context.lineTo(290, 470);
  // si se quiere que el primer punto y el último punto del camino se unan, es decir que se cierre el camino, se utiliza la función closePath(); esto solo es necesario cuando se dibuja el camino con stroke, ya que fill cierra el camino automáticamente cuando lo rellena
  context.closePath();
  context.stroke();
});