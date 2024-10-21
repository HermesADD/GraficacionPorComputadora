class Cono extends GenericGeometry{
  /**
   * Cono
   * @param {Number} radius el tamaño del cono
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius=1, height=1, Nu=1, Nv=3, material= new FlatMaterial(gl), transform= Matrix4.identity()) {
    super(gl,material,transform);
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
    
    // la punta del cono
    vertices.push(0, this.h/2, 0);

    // iteración para construir los paralelos
    for (let i=0; i<this.Nu+1; i++) {
      phi = (i+1)*(this.h/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push( 
          (phi*this.r)/this.h * Math.cos(theta), 
          this.h/2 - phi, 
          (phi*this.r)/this.h * Math.sin(theta) 
        );
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    // triángulos que utilizan la punta del cono (el vértice 0)
    for (let i = 0; i < this.Nv; i++) {
      faces.push(
        0, // índice del polo norte (punta del cono)
        ((i + 1) % this.Nv) + 1,
        (i % this.Nv) + 1
      );
    }

    // Triángulos para las secciones del cuerpo del cono
    for (let i = 0; i < this.Nu; i++) {
      for (let j = 0; j < this.Nv; j++) {
        let v1 = j + 1 + i * this.Nv;
        let v2 = (j + 1) % this.Nv + 1 + i * this.Nv;
        let v3 = (j + 1) % this.Nv + 1 + (i + 1) * this.Nv;
        let v4 = j + 1 + (i + 1) * this.Nv;
      
        // Ajustamos el orden para que los triángulos estén en sentido antihorario desde fuera
        faces.push(v1, v2, v3); // Primer triángulo (antihorario)
        faces.push(v1, v3, v4); // Segundo triángulo (antihorario)
      }
    }
  
    return faces;
  }
}