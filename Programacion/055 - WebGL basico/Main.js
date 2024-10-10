window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  // Se pide el contexto de render de WebGL en su versión 2 ("webgl2") y se almacena en la variable gl para tener a nuestra disposición toda el API de WebGL
  const gl = canvas.getContext("webgl2");

  // Si WebGL no es soportado por el navegador se lanza una excepción
  if (!gl) throw "WebGL no soportado";
  
  //////////////////////////////////////////////////////////////////////////////////////
  // Para utilizar WebGL es necesario construir algunas cosas esenciales
  // Se requiere crear un shader de vértices y uno de fragmentos, y estos conjuntarlos en lo que se conoce como un "programa"
  // Además se requiere construir buffers de datos que almacenaran la información que queremos que la GPU utilice para generar una imagen
  //////////////////////////////////////////////////////////////////////////////////////

  // Los shaders están escritos en GLSL (OpenGL Shading Language), y su código fuente debe ser compilado por la GPU
  // Aquí se define el código del shader de vértices
  let vertexShaderSource = 
  `#version 300 es 
  // la línea anterior determina la versión de GLSL que se va a utilizar, en este caso 300 significa la versión 3.00 que es la última soportada por WebGL2
  // es importante que la primera línea sea la que indica la versión, ya que de lo contrario se utilizara la versión anterior que es la 100 (v 1.00) y los shader pueden no funcionar correctamente
  
  // el modificador "in" determina que la variable que estamos definiendo es una variable de entrada, es decir, va a obtener su valor de algún buffer de datos
  // en este caso esta variable va a contener las coordenadas de un vértice; se utiliza el prefijo "a_" ya que en versiones anteriores de GLSL en lugar de usar "in" se utilizaba el modificador "attribute" y simplemente se usa "a_" como convención para diferenciar las variables
  in vec4 a_position;
  
  // Todos los shaders necesitan una función de entrada, es decir, una función main
  // Esta función no recibe argumentos y no devuelve ningún valor
  void main() {
    // la variable gl_Position es una variable reservada en GLSL y determina el valor final que obtienen las coordenadas de un vértice después de ser transformado y que ahora serán utilizadas por las siguientes etapas del pipeline gráfico
    gl_Position = a_position;
  }`

  // Utilizando el contexto de WebGL, es decir el objeto "gl", se utiliza la función "createShader" con el parámetro "VERTEX_SHADER" para crear un shader de vértices
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // La función "shaderSource" le asocia al shader creado "vertexShader" el contenido almacenado en "vertexShaderSource" como su código fuente
  gl.shaderSource(vertexShader, vertexShaderSource);
  // Una vez que se tiene un shader con su código fuente se utiliza "compileShader" para generar el código ejecutable por la GPU
  gl.compileShader(vertexShader);

  // Al compilar el shader pueden ocurrir errores, así que se le pregunta a "vertexShader" por el parámetro del estado de compilación (COMPILE_STATUS)
  // Si el shader se compilo correctamente el valor devuelto por "getShaderParameter" es true, por lo que revisando por el valor false podemos saber que hubo un error
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    // En caso de error se imprime el problema
    console.log(gl.getShaderInfoLog(vertexShader));
    // Se borra el shader erróneo
    gl.deleteShader(vertexShader);
    // Y se termina la ejecución de la aplicación
    return;
  }
  

  // Aquí se define el código del shader de fragmentos
  let fragmentShaderSource = 
  `#version 300 es
  // Al igual que en el shader de vértices es necesario definir en la primera línea del shader cual es la versión a utilizar; es importante que la versión del shader de vértices sea la misma que la versión del shader de fragmentos
  
  // En el shader de fragmentos es necesario definir cual es la precisión con la que cuentan los números flotantes
  // en caso de no definir la presión se obtiene un el siguiente error: "ERROR: 0:7: '' : No precision specified for (float)"
  precision mediump float;

  // el modificador out indica que la variable va a obtener valores que se utilizaran en las siguientes etapas del pipeline, en este caso el color del píxel que se esta coloreando se debe enviar a la siguiente etapa
  out vec4 pixelColor;

  // Función de entrada del shader de fragmentos. Hay que notar que tanto el shader de vértices como el de fragmentos necesitan definir su propia función "main"
  void main() {
    // La variable pixelColor contiene el color de cada píxel del objeto que se esta dibujando, en este caso: R=0, G=1, B=0 y A=1; por lo que se tiene un color verde
    pixelColor = vec4(0, 1, 0, 1);
  }`;

  // Utilizando el contexto de WebGL, es decir el objeto "gl", se utiliza la función "createShader" con el parámetro "FRAGMENT_SHADER" para crear un shader de fragmentos
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  // Igual que con el shader de vértices es necesario asociar el código fuente y compilarlo
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  // De nuevo se revisa el estado de compilación para saber si todo funciono correctamente
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return;
  }


  // Una vez que se tienen los dos shaders (vértices y fragmentos) se combinan en un solo programa
  // Este programa es el que se ejecuta en la GPU cuando se dibuja por medio de WebGL y podemos tener tantos programas como queramos que combinen diferentes shaders
  let program = gl.createProgram();
  // La función "attachShader" agrega al programa un shader ya compilado
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // Se ligan los shaders al programa y se deja listo para ser utilizado por WebGL
  gl.linkProgram(program);

  // También hay que revisar si se ligaron correctamente los shaders
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  // Una vez que tenemos los shader compilados y vinculados en un "programa" podemos obtener referencias a sus variables para determinar como enviarles información
  // la función "getAttribLocation" devuelve una referencia a una variable dentro del "programa", 
  // en este caso es la variable "a_position", la cual usaremos para enviar información de las coordenadas de nuestros vértices
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");



  // Un Vertex Array Object es un objeto que va a vincular un buffer de datos con variables de los shader, para indicar como dichas variables obtienen sus valores
  // La función "createVertexArray" crea un VAO, por cada objeto que se quiera dibujar hay que crear un VAO para asociar su información
  let triangleVAO = gl.createVertexArray();
  // Una vez creado un VAO es necesario activarlo para que todas las siguientes operaciones se realicen sobre el VAO activo
  gl.bindVertexArray(triangleVAO);

  // Para enviarle información a la variable "a_position" es necesario tener la información de la geometría en la GPU, para esto se utilizan buffers de datos
  // La función "createBuffer" crea en la memoria de la GPU una referencia a un buffer de datos
  let positionBuffer = gl.createBuffer();
  // Como podemos tener varios buffers de datos, hay que indicarle a WebGL en cual de ellos vamos a trabajar
  // La función "bindBuffer" activa un buffer de datos y determina el tipo de buffer, en este caso "ARRAY_BUFFER" indica que es un buffer que contendrá información continua, similar a un arreglo
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Los buffers se utiliza para almacenar cualquier información importante que queremos utilizar dentro de WebGL
  // En este caso queremos tener información geométrica por lo que almacenaremos coordenadas
  // Los datos son simplemente coordenadas almacenadas en un arreglo, en este caso cada tripleta corresponde a las coordenadas x, y, z de un vértice; por lo que al tener 9 valores estamos definiendo las coordenadas de tres vértices
  let positions = [
    -1, -1, 0,
     0,  1, 0,
     1, -1, 0,
  ];
  // La información del arreglo "positions" esta almacenada en un arreglo de JavaScript, es decir, un arreglo que vive en la memoria RAM, pero para utilizar estos datos es necesario que se encuentren dentro de la memoria VRAM (memoria de la GPU)
  // La función "bufferData" se encarga de enviar información de la RAM a la VRAM hacia el buffer activo (bindBuffer); para esto es necesario convertir el arreglo de JavaScript a un arreglo tipado ya que la GPU necesita conocer el tipo de dato que almacena en su memoria y así decidir como acomodarla de la mejor manera
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
 
  // Una vez que tenemos el buffer de datos y la referencia a la variable que queremos asociar, necesitamos decir como se van a leer estos datos
  // Primero activamos la variable que va a recibir los datos del buffer, en este caso es la variable "a_position" cuya referencia esta almacenada en la variable "positionAttributeLocation"
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Una vez activada la variable utilizamos la función "vertexAttribPointer" para configurar como recibirá los datos
  gl.vertexAttribPointer(
    positionAttributeLocation, // la referencia a la variable que va a recibir los datos del buffer activo, en este caso el buffer activo es "positionBuffer"
    3, // el número de elementos que se van a tomar del buffer, en este caso se van a tomar elementos de 3 en 3 ya que cada vértice esta compuesto por 3 coordenadas
    gl.FLOAT, // el tipo de dato que tienen los datos que se leen del buffer
    false, // bandera que indica si los datos se normalizan, esto usualmente conlleva una conversión del tipo de datos, por lo que usualmente se deja en false para evitar cálculos de más 
    0, // determina un salto entre elementos, usualmente queremos que se tomen los elementos de forma continua por eso se le asigna el valor de 0
    0  // determina el desplazamiento al inicio de los datos, lo que permite iniciar en otra posición del buffer, usualmente se toman todos los elementos desde el inicio
  );

  // Se desactiva cualquier buffer que se encontraba activo, esto para prevenir modificaciones por tener buffers activados
  // Esto es importante en aplicaciones más complejas donde se crean varios VAOs y buffers de datos
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Se especifica el color con el que se limpia el canvas de WebGL, en este caso es un color negro
  gl.clearColor(0, 0, 0, 1);



  // Con todo lo anterior tenemos un programa compuesto por un shader de vértices y uno de fragmentos; así como un buffer de datos con información geométrica que queremos dibujar


  /**
   * Función que ejecuta los comandos de dibujado
   */
  function draw() {
    // La función "viewport" le indica a WebGL el tamaño del área que queremos dibujar, esto es necesario para que WebGL pueda aplicar la transformación de la pantalla
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Se limpia el framebuffer donde se almacenan los colores, aquí se utiliza el color determinado con la función "clearColor"
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Se activa el programa
    gl.useProgram(program);

    // se activa el VAO del objeto que queremos dibujar
    gl.bindVertexArray(triangleVAO);

    // La función "drawArrays" se encarga de iniciar el ciclo de ejecución del pipeline gráfico, todo lo anterior a esta llamada simplemente determina el estado de WebGL para dibujar
    gl.drawArrays(
      gl.TRIANGLES, // indica el tipo de primitiva que se va a dibujar, en este es de tipo triángulo
      0, // cual es el primer elemento dentro del buffer de datos, en este caso se inicia desde el 0
      3  // cuantos elementos se van a utilizar para dibujar, en este caso son 3 vértices
    );

    // Se desactiva cualquier VAO utilizado
    gl.bindVertexArray(null);
  }

  // Se ejecuta la función de dibujado
  draw();
});
