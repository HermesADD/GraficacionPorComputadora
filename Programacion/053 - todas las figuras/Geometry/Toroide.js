class Toroide {
  /**
   * Toroide
   * @param {Number} major_radius el radio mayor del toroide
   * @param {Number} major_radius el radio menor del toroide
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(major_radius=1, minor_radius=1, Nu=1, Nv=3, color="#ffffff", transform=identity()) {
    this.R = major_radius;
    this.r = minor_radius;
    this.Nu = Nu;
    this.Nv = Nv;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
  }

  getVertices() {
    let vertices = [];

    for (let i=0; i<this.Nv+1; i++) {
      for (let j=0; j<this.Nu; j++) {
        vertices.push({
          x: -(this.R + this.r * Math.sin(2*Math.PI*j/this.Nu)) * Math.sin(2*Math.PI*i/this.Nv),
          y:  this.r * Math.cos(2*Math.PI*j/this.Nu),
          z:  (this.R + this.r * Math.sin(2*Math.PI*j/this.Nu)) * Math.cos(2*Math.PI*i/this.Nv),
        });
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nv; i++) {
      for (let j=0; j<this.Nu; j++) {
        faces.push([
          j +i*this.Nu,
          j +(i+1)*this.Nu,
          (j+1)%this.Nu +(i+1)*this.Nu,
          (j+1)%this.Nu +i*this.Nu
        ]);
      }
    }
  
    return faces;
  }
}