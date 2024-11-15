class Tetraedro extends GenericGeometry {

  constructor(gl, width , material = FlatMaterial(gl), transform = identity()) {
    super(gl,material,transform);
    this.initialtranform = transform;
    this.material = material;
    this.w = width;
    this.theta = 0;
    this.init(gl);
  }

  update(elapsed) {
    //Movimiento cicliclo en el eje de la X , Sin hace que vaya de un lado a otro y la multiplicacio aumenta que tanto se mueve
    this.transform = multiply(translate(Math.sin(this.theta += elapsed)*4,1,1), this.initialtranform);


    //Movimiento de Rotacion en el eje Y
    //this.transform = multiply(rotateY(this.theta += elapsed),this.initialtranform);


    /*Un movimiento unico se puede hacer casi igual que el ciclico de arriba solo que esta vez en vez de tener un elpased le damos que tanto queremos que avance
     Esto seria con un for(i=0, i > maximo, i += 0.01){
       this.transform = multiply(translate(i*4,1,1), this.initialtranform);
     }
     Lo que esta dentro del transale es en que eje lo vamos a mover , si se quiere hacer movimientos mas complejos se tiene que calcular la direccion como lo hacemos
     en los vectores

     Recuerden esto tambien se debe haer fuera de esta funcion.
    */
    

    // se actualiza la matriz de transformación de las geometrías que muestran las normales
    this.flat_faces_geometry.update(this.transform);
    
  }
  
  getVertices() {
    let angle = 2 * Math.PI / 3;
    let x = this.w * 2 * Math.sqrt(2) / 3;
    let y = -this.w / 3;
    let z = 0;
    let x0 = x * Math.cos(angle);
    let z0 = -x * Math.sin(angle);

    return [
      0, this.w, 0,   // Vértice superior
      x0, y, z0,      // Base - primera esquina
      x0, y, -z0,     // Base - segunda esquina
      x, y, z         // Base - tercera esquina
    ];
  }

  getFaces() {
    return [
      1, 3, 2,  // Base
      0, 1, 2,  // Cara que conecta con el vértice superior
      0, 2, 3,  // Otra cara
      0, 3, 1   // La última cara
    ]
  }
}
  
  