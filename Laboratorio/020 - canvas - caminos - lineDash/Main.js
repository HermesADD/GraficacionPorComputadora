window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  context.lineWidth = 10;

  // Para controlar el estilo con el que se dibujan las líneas de un camino se utiliza la función setLineDash, esta función recibe como argumento un arreglo que indica el tamaño en pixeles de la longitud de la línea y el tamaño del espacio entre cada pedazo de la línea que se va a dibujar

  // Aquí se especifica que se dibuja un pixel de largo con una separación de un pixel
  context.setLineDash([1, 1]);
  context.beginPath();
  context.moveTo(50, 50);
  context.lineTo(750, 50);
  context.stroke();

  // Aquí se especifica que se dibujan 10 píxeles de largo con una separación de 15 píxeles
  context.setLineDash([10, 15]);
  context.beginPath();
  context.moveTo(50, 150);
  context.lineTo(750, 150);
  context.stroke();

  // Esto se puede combinar con la terminación de la línea (lineCap), obteniendo líneas con estilos diversos
  context.setLineDash([10, 15]);
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(50, 250);
  context.lineTo(750, 250);
  context.stroke();

  // Por último, con la variable lineDashOffset es posible modificar un desplazamiento (offset) a partir de donde se inicia la línea
  context.setLineDash([10, 15]);
  context.lineDashOffset = 7;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(50, 350);
  context.lineTo(750, 350);
  context.stroke();
});