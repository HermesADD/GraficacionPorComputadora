class Cono {
  /**
   * Cono
   * @param {Number} radius el tamaño del cono
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(radius=1, height=1, Nu=1, Nv=3, color="#ffffff", transform=identity()) {
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
    
    // la punta del cono
    vertices.push({ x: 0, y: this.h/2, z: 0});

    // iteración para construir los paralelos
    for (let i=0; i<this.Nu+1; i++) {
      phi = (i+1)*(this.h/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push({ 
          x: (phi*this.r)/this.h * Math.cos(theta), 
          y: this.h/2 - phi, 
          z: (phi*this.r)/this.h * Math.sin(theta) 
        });
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    // triángulos que utilizan la punta del cono (el vértice 0)
    for (let i=0; i<this.Nv; i++) {
      faces.push([
        0, // indice del polo norte
        (i%this.Nv)+1,
        ((i+1)%this.Nv)+1, 
      ]);
    }

    for (let i=0; i<this.Nu; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push([ 
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + (i+1)*this.Nv,
        ]);
      }
    }
  
    return faces;
  }
}