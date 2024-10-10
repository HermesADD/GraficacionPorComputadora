window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  context.lineWidth = 30;

  // Cuando el camino no es solo una línea y se utilizan varios lineTo, se obtiene la concatenación de segmentos
  // Para controlar la apariencia de las uniones entre los segmentos que forma un camino se utiliza la variable lineJoin
  // El valor por omisión de la variable lineJoin es "miter"
  context.beginPath();
  context.moveTo(50,  75);
  context.lineTo(100, 25);
  context.lineTo(150, 75);
  context.lineTo(200, 25);
  context.lineTo(250, 75);
  context.stroke();

  // Las uniones en este camino y el anterior se ven iguales
  context.beginPath();
  context.lineJoin = "miter";
  context.moveTo(50,  175);
  context.lineTo(100, 125);
  context.lineTo(150, 175);
  context.lineTo(200, 125);
  context.lineTo(250, 175);
  context.stroke();

  // Para que la unión se vea redondeada se utiliza el valor "round" para la variable lineJoin
  context.beginPath();
  context.lineJoin = "round";
  context.moveTo(50,  275);
  context.lineTo(100, 225);
  context.lineTo(150, 275);
  context.lineTo(200, 225);
  context.lineTo(250, 275);
  context.stroke();

  // Y para que la unión se vea truncada o recortada se utiliza el valor de "bevel"
  context.beginPath();
  context.lineJoin = "bevel";
  context.moveTo(50,  375);
  context.lineTo(100, 325);
  context.lineTo(150, 375);
  context.lineTo(200, 325);
  context.lineTo(250, 375);
  context.stroke();


  context.lineWidth = 2;
  context.strokeStyle = "yellow";
  context.beginPath();
  context.moveTo(500, 500);
  context.lineTo(400,550);
  context.stroke();

});