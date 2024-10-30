class Esfera extends GenericGeometry {
  /**
   */
  constructor(gl, radius=1, Nu=8, Nv=8, material=new FlatMaterial(gl), transform=identity()) {
    super(gl, material, transform);

    this.r = radius;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  /**
   */
  getVertices() {
    let vertices = [];
    let phi;
    let theta;
    
    vertices.push(0, this.r, 0);

    for (let i=0; i<this.Nu; i++) {
      phi = Math.PI/2 - (i+1)*(Math.PI/(this.Nu+1));

      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push(
          this.r * Math.cos(phi) * Math.cos(theta), 
          this.r * Math.sin(phi), 
          this.r * Math.cos(phi) * Math.sin(theta) 
        );
      }
    }

    vertices.push(0, -this.r, 0);

    return vertices;
  }

  /**
   */
  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nv; i++) {
      faces.push(
        0,
        ((i+1)%this.Nv)+1, 
        (i%this.Nv)+1,
      );
    }

    for (let i=0; i<this.Nu-1; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push( 
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + (i+1)*this.Nv,
        );
      }
    }

    for (let i=0; i<this.Nv; i++) {
      faces.push(
        this.vertices.length/3-1, 
        this.vertices.length/3-1 -this.Nv +i, 
        this.vertices.length/3-1 -this.Nv +((i+1)%this.Nv)
      );
    }
  
    return faces;
  }

  /**
   */
  getUVCoordinates(vertices) {
    let uv = [];
    let p, u, v;

    for (let i=0, l=vertices.length/3; i<l; i++) {
      // Se normaliza la posición del vértice, esto hace que la coordenada quede sobre una esfera de radio 1
      p = normalize({x: vertices[i*3], y: vertices[i*3 +1], z: vertices[i*3 +2]});

      // Usando coordenadas polares del punto sobre la esfera unitaria es posible obtener dos valores, similar a lo visto en la cámara orbital

      // Math.atan2 devuelve un ángulo cuyo valor va de -PI a PI, para obtener una coordenada U en el rango [0,1] se divide entre 2PI para tener valores en el intervalo [-1/2, 1/2] y se le suma 0.5 para obtener el rango final [0,1]
      u = 0.5 + (Math.atan2(p.z, p.x) / (2*Math.PI));

      // Math.asin devuelve un ángulo cuyo valor va de -PI/2 a PI/2, para obtener una coordenada V en el rango [0,1] se divide entre PI para tener valores en el intervalo [-1/2, 1/2] y se le suma 0.5 para obtener el rango final [0,1]
      v = 0.5 + (Math.asin(p.y) / Math.PI);

      // se agregan las coordenadas asociadas al vértice
      uv.push(u, v);
    }

    return uv;
  }

}
