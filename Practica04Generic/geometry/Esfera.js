class Esfera extends GenericGeometry{
  /**
   * Esfera
   * @param {Number} radius el tamaño del esfera
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius=1, Nu=8, Nv=8, color="#ffffff", transform=identity()) {
    super(gl, color, transform);

    this.r = radius;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  getVertices() {
    let vertices = [];
    let phi; // la elevación en los paralelos
    let theta; // el ángulo en los meridianos
    
    // el polo norte de la esfera
    vertices.push( 0, this.r, 0);

    // iteración para construir los paralelos
    for (let i=0; i<this.Nu; i++) {
      phi = Math.PI/2 - (i+1)*(Math.PI/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push( 
          this.r * Math.cos(phi) * Math.cos(theta), 
          this.r * Math.sin(phi), 
          this.r * Math.cos(phi) * Math.sin(theta) 
        );
      }
    }

    // el polo sur de la esfera
    vertices.push(0, -this.r, 0);

    return vertices;
  }

  getFaces() {
    let faces = [];

    // triángulos que utilizan el polo norte (el vértice 0)
    for (let i=0; i<this.Nv; i++) {
      faces.push(
        0, // indice del polo norte
        (i%this.Nv)+1,
        ((i+1)%this.Nv)+1, 
      );
    }

    for (let i=0; i<this.Nu-1; i++) {
      for (let j=0; j<this.Nv; j++) {
        let v1 = j+1 + i*this.Nv;
        let v2 = (j+1)%this.Nv +1 + i*this.Nv;
        let v3 = (j+1)%this.Nv +1 + (i+1)*this.Nv;
        let v4 = j+1 + (i+1)*this.Nv;

        // Dividimos el cuadrado en dos triángulos (sin cruzarlos)
        faces.push(v1, v2, v3);  // Primer triángulo
        faces.push(v2, v3, v4);  // Segundo triángulo
      }
    }

    // triángulos que utilizan el polo sur (el vértice en la posición vertices.length-1)
    // triángulos que utilizan el polo sur (el vértice en la posición vertices.length-1)
    for (let i=0; i<this.Nv; i++) {
      faces.push(
        this.vertices.length/3-1, // el indice del polo sur
        this.vertices.length/3-1-this.Nv +i, 
        this.vertices.length/3-1-this.Nv +((i+1)%this.Nv)
      );
    }
  
    return faces;
  }
}