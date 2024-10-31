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

  getUVCoordinates(vertices, isFlat) {
    let uv = [];
    let PI2 = Math.PI * 2;
  
    if (!isFlat) {
      let u, v;
  
      for (let i = 0, l = vertices.length / 3; i < l; i++) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];
  
        // Para mapeo UV, ajustamos considerando la altura y el ángulo del vértice
        u = 0.5 + (Math.atan2(z, x) / PI2);
        v = (y + this.h / 2) / this.h;
  
        uv.push(u, v);
      }
    } else {
      // Para caras planas
      let max_dist = 0.75;
      let p1, p2, p3;
      let u1, v1, u2, v2, u3, v3;
  
      for (let i = 0; i < vertices.length / 3; i += 3) {
        p1 = new Vector3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
        u1 = 0.5 + (Math.atan2(p1.z, p1.x) / PI2);
        v1 = (p1.y + this.h / 2) / this.h;
  
        p2 = new Vector3(vertices[(i + 1) * 3], vertices[(i + 1) * 3 + 1], vertices[(i + 1) * 3 + 2]);
        u2 = 0.5 + (Math.atan2(p2.z, p2.x) / PI2);
        v2 = (p2.y + this.h / 2) / this.h;
  
        p3 = new Vector3(vertices[(i + 2) * 3], vertices[(i + 2) * 3 + 1], vertices[(i + 2) * 3 + 2]);
        u3 = 0.5 + (Math.atan2(p3.z, p3.x) / PI2);
        v3 = (p3.y + this.h / 2) / this.h;
  
        // Ajuste de discontinuidad en coordenadas U
        if (Math.abs(u1 - u2) > max_dist) {
          if (u1 > u2) u2 += 1;
          else u1 += 1;
        }
        if (Math.abs(u1 - u3) > max_dist) {
          if (u1 > u3) u3 += 1;
          else u1 += 1;
        }
        if (Math.abs(u2 - u3) > max_dist) {
          if (u2 > u3) u3 += 1;
          else u2 += 1;
        }
  
        uv.push(u1, v1, u2, v2, u3, v3);
      }
    }
  
    return uv;
  }
}