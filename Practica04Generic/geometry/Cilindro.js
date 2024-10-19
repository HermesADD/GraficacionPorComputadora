class Cilindro extends GenericGeometry{
  /**
   * Cilindro
   * @param {Number} radius el tamaño del cilindro
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius=1, height=1, Nu=1, Nv=3, color="#ffffff", transform=identity()) {
    super(gl, color, transform);
    this.r = radius;
    this.h = height;
    this.Nu = Nu;
    this.Nv = Nv;
    this.init(gl);
  }

  getVertices() {
    let vertices = [];
    let phi; // la elevación en los paralelos
    let theta; // el ángulo en los meridianos
    
    // iteración para construir los paralelos
    for (let i=0; i<this.Nu+2; i++) {
      phi = i*(this.h/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push( 
          this.r * Math.cos(theta), 
          this.h/2 - phi, 
          this.r * Math.sin(theta) 
        );
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];
  
    for (let i = 0; i < this.Nu + 1; i++) {
      for (let j = 0; j < this.Nv; j++) {
        // Índices de los vértices de la cara cuadrada
        let v1 = j + i * this.Nv;
        let v2 = (j + 1) % this.Nv + i * this.Nv;
        let v3 = (j + 1) % this.Nv + (i + 1) * this.Nv;
        let v4 = j + (i + 1) * this.Nv;
  
        // Dividimos el cuadrado en dos triángulos (sin cruzarlos)
        faces.push(v1, v2, v3);  // Primer triángulo
        faces.push(v2, v3, v4);  // Segundo triángulo
      }
    }
  
    return faces;
  }
}