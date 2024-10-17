window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // Se obtienen referencias a los elementos de HTML por medio de su id
  let angulo_inicial = document.getElementById("angulo_inicial");
  let angulo_inicial_rango = document.getElementById("angulo_inicial_rango");
  let angulo_final = document.getElementById("angulo_final");
  let angulo_final_rango = document.getElementById("angulo_final_rango");
  let radio = document.getElementById("radio");

  // se agregan manejadores de eventos para interactuar con el dibujo del canvas

  angulo_inicial.addEventListener("input", function(evt) {
    // se verifica que el valor sea un número
    let val = parseFloat(angulo_inicial.value);
    if (isNaN(val)) {
      angulo_inicial.value = 0;
    }
    // con esto se vincula el valor del campo de texto con el slider
    angulo_inicial_rango.value = angulo_inicial.value;
    // se ejecuta la función para dibujar en el canvas
    draw();
  });

  angulo_inicial_rango.addEventListener("input", function(evt) {
    // con esto se vincula el valor del slider con el campo de texto
    angulo_inicial.value = parseFloat(angulo_inicial_rango.value);
    // se ejecuta la función para dibujar en el canvas
    draw();
  });


  angulo_final.addEventListener("input", function(evt) {
    // se verifica que el valor sea un número
    let val = parseFloat(angulo_final.value);
    if (isNaN(val)) {
      angulo_inicial.value = 0;
    }
    // con esto se vincula el valor del campo de texto con el slider
    angulo_final_rango.value = angulo_final.value;
    // se ejecuta la función para dibujar en el canvas
    draw();
  });

  angulo_final_rango.addEventListener("input", function(evt) {
    // con esto se vincula el valor del slider con el campo de texto
    angulo_final.value = parseFloat(angulo_final_rango.value);
    // se ejecuta la función para dibujar en el canvas
    draw();
  });

  radio.addEventListener("change", function(evt) {
    // se verifica que el valor sea un número
    if (isNaN(parseFloat(radio.value))) {
      radio.value = 150;
    }
    // se ejecuta la función para dibujar en el canvas
    draw();
  });


  // función para dibujar un arco
  function draw() {
    // se obtienen los valores de los controles
    let ini = parseFloat(angulo_inicial.value);
    let fin = parseFloat(angulo_final.value);
    let rad = parseFloat(radio.value);

    // se limpia el canvas
    context.clearRect(0,0,canvas.width,canvas.height);

    // se hace que la línea de dibujo tenga un ancho de 3 píxeles
    context.lineWidth = 3;

    // se construye el camino
    context.beginPath();
    context.arc(
      canvas.width/2, canvas.height/2, // el centro del arco es el centro de la pantalla
      rad,
      ini*Math.PI/180, // se convierten los valores a radianes
      fin*Math.PI/180  // se convierten los valores a radianes
    );
    context.stroke();
  }

  // se dibuja por primera vez el arco
  draw();
});
