class Toroide extends GenericGeometry{
  /**
   * Toroide
   * @param {Number} major_radius el radio mayor del toroide
   * @param {Number} major_radius el radio menor del toroide
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, major_radius=1, minor_radius=1, Nu=1, Nv=3,material = new FlatMaterial(gl), transform=identity()) {
    super(gl,material,transform);
    
    this.R = major_radius;
    this.r = minor_radius;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  getVertices() {
    let vertices = [];

    for (let i=0; i<this.Nv+1; i++) {
      for (let j=0; j<this.Nu; j++) {
        vertices.push(
          -(this.R + this.r * Math.sin(2*Math.PI*j/this.Nu)) * Math.sin(2*Math.PI*i/this.Nv),
            this.r * Math.cos(2*Math.PI*j/this.Nu),
           (this.R + this.r * Math.sin(2*Math.PI*j/this.Nu)) * Math.cos(2*Math.PI*i/this.Nv),
        );
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nv; i++) {
      for (let j=0; j<this.Nu; j++) {
        let v1 = j +i*this.Nu;
        let v2 = j +(i+1)*this.Nu;
        let v3 = (j+1)%this.Nu +(i+1)*this.Nu;
        let v4 = (j+1)%this.Nu +i*this.Nu;
        
        // Dividimos el cuadrado en dos triángulos (sin cruzarlos)
        faces.push(v1, v2, v3);  // Primer triángulo
        faces.push(v1, v3, v4);  // Segundo triángulo
      }
    }
  
    return faces;
  }
}