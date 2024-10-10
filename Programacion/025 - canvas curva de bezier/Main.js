window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  let init_point = { x: 200, y: 100 };
  let control_point_1 = { x: 150, y: 300 };
  let control_point_2 = { x: 350, y: 410 };
  let end_point = { x: 500, y: 175 };

  context.lineWidth = 1;
  context.setLineDash([8, 5]);
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(init_point.x, init_point.y);
  context.lineTo(control_point_1.x, control_point_1.y);
  context.lineTo(control_point_2.x, control_point_2.y);
  context.lineTo(end_point.x, end_point.y);
  context.stroke();

  // El canvas permite dibujar una curva (de Bézier de grado tres) con la función bezierCurveTo
  context.lineWidth = 10;
  context.setLineDash([]);
  context.strokeStyle = "rgba(100,0,0,0.5)";
  context.beginPath();
  context.moveTo(init_point.x, init_point.y);
  context.bezierCurveTo(
    control_point_1.x, control_point_1.y,
    control_point_2.x, control_point_2.y, 
    end_point.x, end_point.y
  );
  //context.lineTo(end_point.x, end_point.y);
  context.stroke();
});