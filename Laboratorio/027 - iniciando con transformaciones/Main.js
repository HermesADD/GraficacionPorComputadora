window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // se especifican las coordenadas de cuatro vértices que se van a utilizara para determinar dos triángulos
  let vertices = [
    { x:  1, y: -1, z: 0 }, //0
    { x:  1, y:  1, z: 0 }, //1
    { x: -1, y:  1, z: 0 }, //2
    { x: -1, y: -1, z: 0 }  //3
  ];
  
  // se relacionan los vértices por medio de tripletas de indices de vértices
  let faces = [
    // el primer triángulo esta compuesto por:
    // el vértice 0 = (1, -1, 0), 
    // el vértice 1 = (1, 1, 0) y 
    // el vértice 2 = (-1, 1, 0)
    [0, 1, 2], 

    // el segundo triángulo esta compuesto por:
    // el vértice 3 = (-1, -1, 0), 
    // el vértice 0 = (1, -1, 0) y 
    // el vértice 2 = (-1, 1, 0)
    [3, 0, 2]
  ];

  // se determina el origen donde se dibujaran los objetos, en este caso el centro de la pantalla
  let Ox = canvas.width/2;
  let Oy = canvas.height/2;

  // esta es una variable que permite escalar el tamaño de la geometría
  // esto es útil en estos ejemplos, porque las coordenadas están en píxeles (valores pequeño) y no son visibles
  let zoom = 50;

  // la función que dibuja la geometría
  function draw() {
    // se limpia la pantalla
    context.clearRect(0, 0, canvas.width, canvas.height);

    // se itera sobre todos los elementos que conforman la geometría
    // en este caso solo son dos elementos (los dos triángulos que se definieron antes)
    faces.forEach((face) => {
      // se inicia un camino
      context.beginPath();

      // se itera sobre los 3 vértices de cada triángulo
      face.forEach((vertex_index, index) => {
        let vertex = vertices[vertex_index];

        // para el primer vértice solo se mueve la pluma para dibujar
        if (index === 0) {
          context.moveTo(vertex.x*zoom + Ox, vertex.y*zoom + Oy);
        }
        // para el resto de los vértices ya se crean las líneas
        else {
          context.lineTo(vertex.x*zoom + Ox, vertex.y*zoom + Oy);
        }
      });

      // el camino construido se cierra
      context.closePath();
      // y se dibuja
      context.stroke();
    });
  }

  // se dibuja la escena
  draw();
});