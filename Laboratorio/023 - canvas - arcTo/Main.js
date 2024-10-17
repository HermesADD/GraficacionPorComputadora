window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // Algunas variables para dibujar un camino que inicia en el punto init_point, pasa por el punto middle_point y termina en el punto end_point
  let init_point = { x: 200, y: 100 };
  let middle_point = { x: 150, y: 300 };
  let end_point = { x: 500, y: 175 };

  // Se dibuja un camino directamente con líneas punteadas
  context.lineWidth = 1;
  context.setLineDash([8, 5]);
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(init_point.x, init_point.y);
  context.lineTo(middle_point.x, middle_point.y);
  context.lineTo(end_point.x, end_point.y);
  context.stroke();

  // Sobre el camino anterior se dibuja un nuevo camino, pero en este caso con una línea solida de color rojo medio transparente
  // Para este camino se utiliza la instrucción arcTo(x1, y1, x2, y2, radio), con la que se considera el último punto donde termino la "pluma" de dibujo del canvas (en este caso esta dado por la instrucción moveTo) y se construye una línea que une este último punto con el punto (x1,y1), además se construye la línea que va del punto (x1,y1) hasta el punto (x2,y2); una vez construidas estas dos líneas se construye un círculo que es tangente a las dos líneas anteriores y al final se dibuja el resultado
  context.lineWidth = 10;
  context.setLineDash([]); // para recuperar el estilo sólido se le pasa un arreglo vacío
  context.strokeStyle = "rgba(100,0,0,0.5)";
  context.beginPath();
  context.moveTo(init_point.x, init_point.y);
  context.arcTo(
    middle_point.x, middle_point.y, 
    end_point.x, end_point.y, 
    100
  );
  //context.lineTo(end_point.x, end_point.y);
  context.stroke();
});