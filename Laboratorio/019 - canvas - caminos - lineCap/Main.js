window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  context.lineWidth = 50;

  // Para controlar el estilo con el que se dibujan los extremos de un camino se utiliza la variable lineCap
  // El valor por omisión de la variable lineCap es "butt" lo que causa que los extremos se corten directamente en la posición indicada en los extremos
  context.beginPath();
  context.moveTo(60, 50);
  context.lineTo(500, 50);
  context.stroke();

  // La siguiente línea y la anterior se dibujan igual, por que tienen el mismo valor de lineCap
  context.beginPath();
  context.lineCap = "butt";
  context.moveTo(60, 150);
  context.lineTo(500, 150);
  context.stroke();

  // Al usar el valor de "round" para la variable lineCap los extremos se dibujan de forma redondeada
  context.beginPath();
  context.lineCap = "round";
  context.moveTo(60, 250);
  context.lineTo(500, 250);
  context.stroke();

  // Al usar el valor de "square" para la variable lineCap los extremos se dibujan como rectángulos extendidos más allá de los extremos del camino
  context.beginPath();
  context.lineCap = "square";
  context.moveTo(60, 350);
  context.lineTo(500, 350);
  context.stroke();
});