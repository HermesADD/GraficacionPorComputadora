window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // Además de rectángulos y caminos, el canvas permite dibujar arcos (pedazos de círculos y circunferencias)

  // Se configuran las opciones generales para dibujar
  context.lineWidth = 10;
  context.strokeStyle = "purple";
  context.fillStyle = "green";

  // La función arc(x, y, radio, ángulo_inicial, ángulo_final, dirección); determina un círculo cuyo centro esta en la posición (x,y) con un radio determinado y de ese círculo solo se considera el pedazo comprendido entre el ángulo inicial y el ángulo final; el último parámetro determina si la dirección en la que se determinan los ángulos es en dirección de las manecillas del reloj o en contra, si se omite la dirección el valor por omisión es falso, lo que indica que se dibuja en dirección de las manecillas del reloj

  context.beginPath();
  context.arc(100, 100, 25, 0, Math.PI);
  context.stroke();

  context.beginPath();
  context.arc(300, 100, 25, 0, Math.PI, true);
  context.stroke();

  // El orden en que se llaman las funciones stroke y fill es importante dependiendo de como se quieren dibujar los caminos
  context.lineCap = "round";
  context.beginPath();
  context.arc(100, 200, 25, 0, Math.PI);
  // Aquí primero se dibuja la línea y luego el relleno
  context.stroke();
  context.fill();

  context.beginPath();
  context.arc(300, 200, 25, 0, Math.PI);
  // Aquí primero se dibuja el relleno y luego la línea
  context.fill();
  context.stroke();

  // La función arc mueve la "pluma" de dibujo del camino, por lo que si no se quiere que se empalmen los arcos hay que englobarlos en un camino con beginPath; de lo contrario pueden dibujarse líneas entre los arcos
  context.lineCap = "square";
  context.beginPath();
  context.arc(100, 300, 25, 0, Math.PI);
  context.stroke();
  context.fill();

  context.beginPath();
  context.arc(300, 300, 25, 0, Math.PI);
  context.fill();
  context.stroke();
});