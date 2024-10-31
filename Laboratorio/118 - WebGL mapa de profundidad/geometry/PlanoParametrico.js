class PlanoParametrico extends GenericGeometry {
  /**
   */
  constructor(gl, width=1, length=1, Nu=8, Nv=8, material=new FlatMaterial(gl), transform=identity()) {
    super(gl, material, transform);

    this.width = width;
    this.length = length;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  /**
   */
  getVertices() {
    let vertices = [];
    
    let x_step = this.width/this.Nu;
    let y_step = this.width/this.Nv;

    this.temp_uv = [];

    for (let i=0; i<this.Nu+1; i++) {
      for (let j=0; j<this.Nv+1; j++) {
        vertices.push(
          -this.width/2 +i*x_step, 
          0,
          -this.length/2 +j*y_step
        );
      }
    }

    return vertices;
  }

  /**
   */
  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nu; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push( 
          j + i*(this.Nv+1),
          j+1 + i*(this.Nv+1),
          j + (i+1)*(this.Nv+1),

          j + (i+1)*(this.Nv+1),
          j+1 + i*(this.Nv+1),
          j+1 + (i+1)*(this.Nv+1),
        );
      }
    }

    return faces;
  }

  /**
   */
  getUVCoordinates(vertices) {
    let uv = [];
    for (let i=0; i<vertices.length/3; i++) {
      uv.push(
        (vertices[i*3]+this.width/2)/this.width,
        (vertices[i*3 +2]+this.length/2)/this.length,
      )
    }

    return uv;
  }

}
