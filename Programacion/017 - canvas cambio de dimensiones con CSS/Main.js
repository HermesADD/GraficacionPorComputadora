window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "red";
  context.fillRect(100, 100, 50, 120);

  context.clearRect(0, 0, 20, 20);

  context.lineWidth = 5;
  context.strokeStyle = "yellow";
  context.strokeRect(20, 20, canvas.width-40, canvas.height-40);
});