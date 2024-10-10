window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // La función fillRect(x,y,w,h) es una función del canvas que dibuja un rectángulo relleno cuya esquina superior izquierda se encuentra en la posición (x,y); y con un ancho de w y alto de h
  context.fillRect(0, 0, canvas.width, canvas.height);

  // El rectángulo anterior se dibuja de un color negro, porque es el valor por defecto de la variable fillStyle
  // al cambiar el valor de fillStyle se puede dibujar un rectángulo relleno con ese color
  // La variable fillStyle es general para cualquier comando de dibujado que aparezca después
  context.fillStyle = "red";

  // Se dibuja un rectángulo cuya esquina superior izquierda esta en las coordenadas (100,100) con 50 pixeles de ancho y 120 de alto; como el valor de fillStyle es "red", el rectángulo se dibuja de color rojo
  context.fillRect(100, 100, 50, 120);

  context.fillStyle = "green"

  context.fillRect(250, 250, 50, 120);

  // La función es clearRect es similar a la función fillRect pero en lugar de rellenar un rectángulo con un color, lo que hace es limpiar los píxeles del rectángulo indicado
  context.clearRect(0, 0, 20, 20);

  // Al igual que se pueden dibujar figuras rellenas, se pueden dibujar sus contornos
  // La variable lineWidth determina el ancho de la línea con la que se dibuja el contorno de una figura
  context.lineWidth = 5;
  // La variable strokeStyle corresponde al color con el que se dibuja el contorno de una figura
  context.strokeStyle = "yellow";
  // La función strokeRect funciona igual que las funciones anteriores (de rectángulos) pero dibuja solo el contorno
  context.strokeRect(20, 20, canvas.width-40, canvas.height-40);
});