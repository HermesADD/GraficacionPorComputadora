let epsilon = 0.000001;

/** 
 * La clase Vector3 representa vectores de tres componentes, x, y y z.
 */
class Vector3 {
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  constructor(x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Función que devuelve la suma de sus argumentos
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Vector3}
   */
  static add(u, v) {
    return new Vector3(u.x + v.x, u.y + v.y, u.z + v.z);
  }

  /**
   * Función que devuelve un vector el cual contiene los mismos valores que el vector desde el cual se invocó la función.
   * @return {Vector3}
   */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Función que devuelve el producto cruz de sus argumentos.
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Vector3}
   */
  static cross(u, v) {
    const x0 = u.y * v.z - u.z * v.y;
    const y0 = u.z * v.x - u.x * v.z;
    const z0 = u.x * v.y - u.y * v.x;

    return new Vector3(x0 , y0, z0);
  }

  /**
   * Función que devuelve la distancia euclidiana que hay entre sus argumentos.
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Number}
   */
  static distance(u, v) {
    const dx = u.x - v.x; 
    const dy = u.y - v.y;
    const dz = u.z - v.z;

    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  }

  /**
   * Función que devuelve el producto punto de sus argumentos.
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Number}
   */
  static dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente iguales (con una epsilon = 0.000001), y falso en caso contrario.
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Boolean}
   */
  static equals(u, v) {
    return (
      Math.abs(u.x - v.x) < epsilon &&
      Math.abs(u.y - v.y) < epsilon &&
      Math.abs(u.z - v.z) < epsilon
    );
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean exactamente iguales y falso en caso contrario.
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Boolean}
   */
  static exactEquals(u, v) {
    return u.x === v.x && u.y === v.y && u.z === v.z;
  }

  /**
   * Función que devuelve el vector resultado de la normalización del vector que invoca la función.
   * @return {Vector3}
   */
  normalize() {
    const magnitud = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    
    if (magnitud > 0) {
      return new Vector3(this.x / magnitud, this.y / magnitud, this.z / magnitud);
    }
    return new Vector3(0, 0, 0);
  }

  /**
   * Función que asigna nuevos valores a los componentes del vector con que se llama.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  set(x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Función que devuelve la resta de sus argumentos
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Vector3}
   */
  static subtract(u, v) {
    return new Vector3(u.x - v.x, u.y - v.y, u.z - v.z);
  }

  /**
   * Función que devuelve la distancia euclidiana al cuadrado que hay entre sus argumentos.
   * @param {Vector3} u
   * @param {Vector3} v
   * @return {Number}
   */
  static squaredDistance(u, v) {
    return this.distance(u,v) * this.distance(u,v);
  }

  /**
   * Función que asigna cero a cada componente del vector que invoca la función.
   */
  zero() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
}

/** 
 * La clase Matrix3 representa matrices de 3 × 3. Y se utilizará para la representación y construcción de transformaciones en dos dimensiones.
 */
class Matrix3 {
  /**
   * @param {Number} a00
   * @param {Number} a01
   * @param {Number} a02
   * @param {Number} a10
   * @param {Number} a11
   * @param {Number} a12
   * @param {Number} a20
   * @param {Number} a21
   * @param {Number} a22
   */
  constructor(
    a00=1, a01=0, a02=0, 
    a10=0, a11=1, a12=0, 
    a20=0, a21=0, a22=1
  ) {
    this.a00 = a00;
    this.a01 = a01;
    this.a02 = a02;
    this.a10 = a10;
    this.a11 = a11;
    this.a12 = a12;
    this.a20 = a20;
    this.a21 = a21;
    this.a22 = a22;
  }

  /**
   * Función que devuelve la suma de dos matrices.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static add(m1, m2) {
    return new Matrix3(
      m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02,
      m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12,
      m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22
    )
  }

  /**
   * Función que devuelve la matriz adjunta (o matriz de cofactores), de la matriz con que se invoca la función.
   * @return {Matrix3}
   */
  adjoint() {
    return new Matrix3(
      (this.a11 * this.a22 - this.a12 * this.a21),  // Cofactor de a00
      -(this.a10 * this.a22 - this.a12 * this.a20), // Cofactor de a01
      (this.a10 * this.a21 - this.a11 * this.a20),  // Cofactor de a02
      -(this.a01 * this.a22 - this.a02 * this.a21), // Cofactor de a10
      (this.a00 * this.a22 - this.a02 * this.a20),  // Cofactor de a11
      -(this.a00 * this.a21 - this.a01 * this.a20), // Cofactor de a12
      (this.a01 * this.a12 - this.a02 * this.a11),  // Cofactor de a20
      -(this.a00 * this.a12 - this.a02 * this.a10), // Cofactor de a21
      (this.a00 * this.a11 - this.a01 * this.a10)   // Cofactor de a22
    );
  

  }

  /**
   * Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde el cual se invocó la función.
   * @return {Matrix3}
   */
  clone() {
    return new Matrix3(
      this.a00, this.a01, this.a02,
      this.a10, this.a11, this.a12,
      this.a20, this.a21, this.a22
    );
  }

  /**
   * Función que devuelve el determinante de la matriz.
   * @return {Number}
   */
  determinant() {
    return (
      this.a00 * (this.a11 * this.a22 - this.a12 * this.a21) -
      this.a01 * (this.a10 * this.a22 - this.a12 * this.a20) +
      this.a02 * (this.a10 * this.a21 - this.a11 * this.a20)
    );
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente iguales (con una epsilon = 0.000001) y falso en caso contrario.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Boolean}
   */
  static equals(m1, m2) {
    return (
      Math.abs(m1.a00 - m2.a00) < epsilon &&
      Math.abs(m1.a01 - m2.a01) < epsilon &&
      Math.abs(m1.a02 - m2.a02) < epsilon &&
      Math.abs(m1.a10 - m2.a10) < epsilon &&
      Math.abs(m1.a11 - m2.a11) < epsilon &&
      Math.abs(m1.a12 - m2.a12) < epsilon &&
      Math.abs(m1.a20 - m2.a20) < epsilon &&
      Math.abs(m1.a21 - m2.a21) < epsilon &&
      Math.abs(m1.a22 - m2.a22) < epsilon
    );
  }

  /**
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Boolean}
   */
  static exactEquals(m1, m2) {
    return (
      m1.a00 === m2.a00 && m1.a01 === m2.a01 && m1.a02 === m2.a02 &&
      m1.a10 === m2.a10 && m1.a11 === m2.a11 && m1.a12 === m2.a12 &&
      m1.a20 === m2.a20 && m1.a21 === m2.a21 && m1.a22 === m2.a22
    );
  }

  /**
   * Función que asigna los valores de la matriz identidad a la matriz desde donde se invocó la función.
   */
  identity() {
    this.a00 = 1; this.a01 = 0; this.a02 = 0;
    this.a10 = 0; this.a11 = 1; this.a12 = 0;
    this.a20 = 0; this.a21 = 0; this.a22 = 1;
  }

  /**
   * Función que devuelve la matriz inversa de la matriz con la que se invocó la función.
   * @return {Matrix3}
   */
  invert() {
    const det = this.determinant();
    if (Math.abs(det) < epsilon) {
      throw new Error('La matriz no es invertible');
    }

    const adj = this.adjoint();
    return Matrix3.multiplyScalar(adj, 1 / det);
  }

  /**
   * Función que devuelve la multiplicación de dos matrices.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static multiply(m1, m2) {
    return new Matrix3(
      m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20, 
      m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21, 
      m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22, 

      m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20,
      m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21,
      m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22,

      m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20,
      m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21,
      m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22
    );
  }

  /**
   * Función que devuelve una matriz que es el resultado de multiplicar cada componente por un escalar.
   * @param {Matrix3} m1
   * @param {Number} c
   * @return {Matrix3}
   */
  static multiplyScalar(m1, c) {
    return new Matrix3(
      m1.a00 * c, m1.a01 * c, m1.a02 * c,
      m1.a10 * c, m1.a11 * c, m1.a12 * c,
      m1.a20 * c, m1.a21 * c, m1.a22 * c
    );
  }

  /**
   * Función que devuelve el vector resultado de multiplicar el vector v por la matriz con que se llama la función. Esta función es la que nos va a permitir realizar las transformaciones.
   * @param {Vector3} v
   * @return {Vector3}
   */
  multiplyVector(v) {
    const x = this.a00 * v.x + this.a01 * v.y + this.a02 * v.z;
    const y = this.a10 * v.x + this.a11 * v.y + this.a12 * v.z;
    const z = this.a20 * v.x + this.a21 * v.y + this.a22 * v.z;

    return new Vector3(x,y,z);
  }

  /**
   * Función que devuelve una matriz de 3 × 3 que representa una transformación de rotación en dos dimensiones de theta radianes.
   * @param {Number} theta
   * @return {Matrix3}
   */
  static rotate(theta) {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
  
    return new Matrix3(
      cosTheta, -sinTheta, 0,
      sinTheta, cosTheta, 0,
      0, 0, 1
    );
  }

  /**
   * Función que devuelve una matriz de 3 × 3 que representa una transformación de escalamiento en dos dimensiones, con el factor sx como escalamiento en x y sy como escalamiento en y, la componente z no se modifica.
   * @param {Number} sx
   * @param {Number} sy
   * @return {Matrix3}
   */
  static scale(sx, sy) {
    return new Matrix3(
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    );
  }

  /**
   * Función que asigna nuevos valores a los componentes de la matriz con que se llama.
   * @param {Number} a00
   * @param {Number} a01
   * @param {Number} a02
   * @param {Number} a10
   * @param {Number} a11
   * @param {Number} a12
   * @param {Number} a20
   * @param {Number} a21
   * @param {Number} a22
   */
  set(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
    this.a00 = a00;
    this.a01 = a01;
    this.a02 = a02;
    this.a10 = a10;
    this.a11 = a11;
    this.a12 = a12;
    this.a20 = a20;
    this.a21 = a21;
    this.a22 = a22;
  }

  /**
   * Función que sustrae componente a componente la matriz m2 de la matriz m1.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static subtract(m1, m2) {
    return new Matrix3(
      m1.a00 - m2.a00, m1.a01 - m2.a01, m1.a02 - m2.a02,
      m1.a10 - m2.a10, m1.a11 - m2.a11, m1.a12 - m2.a12,
      m1.a20 - m2.a20, m1.a21 - m2.a21, m1.a22 - m2.a22
    );
  }

  /**
   * Función que devuelve una matriz de 3 × 3 que representa una transformación de traslación en dos dimensiones, con tx como la traslación en x y ty como la traslación en y, la componente z no se modifica.
   * @param {Number} tx
   * @param {Number} ty
   * @return {Matrix3}
   */
  static translate(tx, ty) {
    return new Matrix3(
      1, 0, tx,
      0, 1, ty,
      0, 0, 1
    );
  }

  /**
   * Función que devuelve la matriz transpuesta de la matriz desde donde se invocó la función.
   * @return {Matrix3}
   */
  transpose() {
    return new Matrix3(
      this.a00, this.a10, this.a20,
      this.a01, this.a11, this.a21,
      this.a02, this.a12, this.a22
    );
  }
}