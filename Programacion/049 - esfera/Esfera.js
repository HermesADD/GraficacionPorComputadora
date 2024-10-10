class Esfera {
  /**
   * Esfera
   * @param {Number} radius el tamaño del esfera
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(radius=1, Nu=8, Nv=8, color="#ffffff", transform=identity()) {
    this.r = radius;
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
    
    // el polo norte de la esfera
    vertices.push({ x: 0, y: this.r, z: 0});

    // iteración para construir los paralelos
    for (let i=0; i<this.Nu; i++) {
      phi = Math.PI/2 - (i+1)*(Math.PI/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push({ 
          x: this.r * Math.cos(phi) * Math.cos(theta), 
          y: this.r * Math.sin(phi), 
          z: this.r * Math.cos(phi) * Math.sin(theta) 
        });
      }
    }

    // el polo sur de la esfera
    vertices.push({ x: 0, y: -this.r, z: 0});

    return vertices;
  }

  getFaces() {
    let faces = [];

    // triángulos que utilizan el polo norte (el vértice 0)
    for (let i=0; i<this.Nv; i++) {
      faces.push([
        0, // indice del polo norte
        (i%this.Nv)+1,
        ((i+1)%this.Nv)+1, 
      ]);
    }

    for (let i=0; i<this.Nu-1; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push([ 
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + (i+1)*this.Nv,
        ]);
      }
    }

    // triángulos que utilizan el polo sur (el vértice en la posición vertices.length-1)
    for (let i=0; i<this.Nv; i++) {
      faces.push([
        this.vertices.length-1, // el indice del polo sur
        this.vertices.length-1-this.Nv +i, 
        this.vertices.length-1-this.Nv +((i+1)%this.Nv)
      ]);
    }
  
    return faces;
  }
}