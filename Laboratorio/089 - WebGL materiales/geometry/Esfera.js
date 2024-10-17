class Esfera extends GenericGeometry {
  /**
   */
  constructor(gl, radius=1, Nu=8, Nv=8, material=new FlatMaterial(gl), transform=identity()) {
    super(gl, material, transform);

    this.r = radius;
    this.Nu = Nu;
    this.Nv = Nv;

    // Se obtienen los vértices y se construyen los buffers de datos correspondientes
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
}
