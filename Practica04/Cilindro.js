class Cilindro {
  /**
   * Cilindro
   * @param {Number} radius el tamaño del cilindro
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius=1, height=1, Nu=1, Nv=3, color="#ffffff", transform=identity()) {
    this.gl = gl;
    this.r = radius;
    this.h = height;
    this.Nu = Nu;
    this.Nv = Nv;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
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

        vertices.push({ 
          x: this.r * Math.cos(theta), 
          y: this.h/2 - phi, 
          z: this.r * Math.sin(theta) 
        });
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nu+1; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push([ 
          j + i*this.Nv,
          (j+1)%this.Nv + i*this.Nv,
          (j+1)%this.Nv + (i+1)*this.Nv,
          j + (i+1)*this.Nv,
        ]);
      }
    }
  
    return faces;
  }
}