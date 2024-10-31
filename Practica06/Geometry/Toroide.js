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

  getUVCoordinates(vertices, isFlat) {
    let uv = [];
    let PI2 = Math.PI*2;

    if (!isFlat) {
      let p, u, v;

      for (let i=0, l=vertices.length/3; i<l; i++) {
        p = new Vector3(vertices[i*3], vertices[i*3 +1], vertices[i*3 +2]).normalize();

        uv.push(
          0.5 + (Math.atan2(p.z, p.x) / PI2),
          0.5 + (Math.asin(p.y) / Math.PI)
        );
      }
    }
    else {
      let max_dist = 0.75;
      let p1, p2, p3;
      let u1, v1, u2, v2, u3, v3;

      for (let i=0; i<vertices.length/3; i+=3) {
        p1 = new Vector3(vertices[i*3], vertices[i*3 +1], vertices[i*3 +2]).normalize();
        u1 = 0.5 + (Math.atan2(p1.z, p1.x) / PI2);
        v1 = 0.5 + (Math.asin(p1.y) / Math.PI);

        p2 = new Vector3(vertices[(i+1)*3], vertices[(i+1)*3 +1], vertices[(i+1)*3 +2]).normalize();
        u2 = 0.5 + (Math.atan2(p2.z, p2.x) / PI2);
        v2 = 0.5 + (Math.asin(p2.y) / Math.PI);

        p3 = new Vector3(vertices[(i+2)*3], vertices[(i+2)*3 +1], vertices[(i+2)*3 +2]).normalize();
        u3 = 0.5 + (Math.atan2(p3.z, p3.x) / PI2);
        v3 = 0.5 + (Math.asin(p3.y) / Math.PI);

        if (Math.abs(u1-u2) > max_dist) {
          if (u1 > u2) {
            u2 = 1 + u2;
          }
          else {
            u1 = 1 + u1;
          }
        }
        if (Math.abs(u1-u3) > max_dist) {
          if (u1 > u3) {
            u3 = 1 + u3;
          }
          else {
            u1 = 1 + u1;
          }
        }
        if (Math.abs(u2-u3) > max_dist) {
          if (u2 > u3) {
            u3 = 1 + u3;
          }
          else {
            u2 = 1 + u2;
          }
        }

        uv.push( u1, v1, u2, v2, u3, v3 );
      }
    }

    return uv;
  }
}