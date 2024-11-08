class Anillos extends GenericGeometry {
  constructor(gl, outerRadius, innerRadius, segments, material, transform) {
    super(gl, material, transform);
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.segments = segments;
    this.init(gl);
  }

  // Método para obtener los vértices del disco
  getVertices() {
    const vertices = [];
    const angleIncrement = (2 * Math.PI) / this.segments;

    // Generar vértices para el radio interno
    for (let i = 0; i < this.segments; i++) {
      const angle = i * angleIncrement;
      vertices.push(this.innerRadius * Math.cos(angle), 0, this.innerRadius * Math.sin(angle));
    }

    // Generar vértices para el radio externo
    for (let i = 0; i < this.segments; i++) {
      const angle = i * angleIncrement;
      vertices.push(this.outerRadius * Math.cos(angle), 0, this.outerRadius * Math.sin(angle));
    }

    return vertices;
  }

  // Método para obtener las caras (índices) del disco
  getFaces() {
    const faces = [];
    const segments = this.segments;

    for (let i = 0; i < segments; i++) {
      // Triángulo del segmento (i) conectando vértices del radio interno y externo
      const inner1 = i;
      const inner2 = (i + 1) % segments;
      const outer1 = i + segments;
      const outer2 = (i + 1) % segments + segments;

      // Crear dos triángulos para formar el cuadrilátero entre los radios
      faces.push(inner1, outer1, outer2);
      faces.push(inner1, outer2, inner2);
    }

    return faces;
  }

  // Método para obtener las coordenadas UV para mapear la textura en el disco
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
