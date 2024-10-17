class OBJGeometry {
  /**
   * OBJGeometry
   * @param {String} data la información del archivo obj
   * @param {Matrix4} transform la transformación del objeto
   */
  constructor(data="", color="#ff0000", transform=identity()) {
    this.data = data;
    this.color = color;
    this.transform = transform;

    // se divide la información del .obj en un arreglo de líneas de texto
    let lines = data.split("\n");
    this.vertices = [];
    this.faces = [];
    let tmp1, tmp2, tmp3, tmp4;
    let temp;

    // se itera sobre cada línea de texto
    for (const line of lines) {
      // se obtienen los vértices de la forma v x y z
      if (line.startsWith("v ")) {
        // se divide la línea por medio de los espacios en blanco, obteniendo un arreglo de la forma [v, x, y, z]
        temp = line.split(" ");
        // se extrae la información de las coordenadas del vértice
        this.vertices.push({
          x: parseFloat(temp[1]),
          y: parseFloat(temp[2]),
          z: parseFloat(temp[3])
        });
      }
      // se obtienen las caras de la forma f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
      else if (line.startsWith("f ")) {
        // se divide la línea por medio de los espacios en blanco, obteniendo un arreglo de la forma [f, v1/vt1/vn1, v2/vt2/vn2, v3/vt3/vn3], en caso de que tenga cuadriláteros sera de la forma [f, v1/vt1/vn1, v2/vt2/vn2, v3/vt3/vn3, v4/vt4/vn4]
        temp = line.split(" ");

        // Un triángulo tiene cuatro elementos porque el primero es "f", los otros tres corresponden a los indices de los vértices
        if (temp.length === 4) {
          tmp1 = temp[1].split("/");
          tmp2 = temp[2].split("/");
          tmp3 = temp[3].split("/");

          // La variable tmp1 es de la forma [v1, vt1, vn1], entonces en la primera posición esta la información del indice del vértice
          // lo mismo ocurre en las otras variables temporales
          // Los indices en el .obj inician en 1 (en lugar de 0) por lo que hay que restarles 1
          this.faces.push([
            parseInt(tmp1[0]) -1,
            parseInt(tmp2[0]) -1,
            parseInt(tmp3[0]) -1
          ]);
        }
        // Un cuadrilátero tiene cinco elementos, "f" al inicio y cuatro elementos para los indices de los vértices
        else if (temp.length === 5) {
          tmp1 = temp[1].split("/");
          tmp2 = temp[2].split("/");
          tmp3 = temp[3].split("/");
          tmp4 = temp[4].split("/");

          this.faces.push([
            parseInt(tmp1[0]) -1,
            parseInt(tmp2[0]) -1,
            parseInt(tmp3[0]) -1,
            parseInt(tmp4[0]) -1
          ]);
        }
      }
    }
  }
}
