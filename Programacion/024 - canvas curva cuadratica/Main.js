window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  let init_point = { x: 200, y: 100 };
  let middle_point = { x: 150, y: 300 };
  let end_point = { x: 500, y: 175 };

  context.lineWidth = 1;
  context.setLineDash([8, 5]);
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(init_point.x, init_point.y);
  context.lineTo(middle_point.x, middle_point.y);
  context.lineTo(end_point.x, end_point.y);
  context.stroke();

  // El canvas permite dibujar una curva (de Bézier de grado dos) con la función quadraticCurveTo
  context.lineWidth = 10;
  context.setLineDash([]);
  context.strokeStyle = "rgba(100,0,0,0.5)";
  context.beginPath();
  context.moveTo(init_point.x, init_point.y);
  context.quadraticCurveTo(
    middle_point.x, middle_point.y, 
    end_point.x, end_point.y
  );
  context.lineTo(end_point.x, end_point.y);
  context.stroke();
});