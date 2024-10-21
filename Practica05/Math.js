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
    const c00 = this.a11 * this.a22 - this.a12 * this.a21;
    const c01 = -(this.a10 * this.a22 - this.a12 * this.a20);
    const c02 = this.a10 * this.a21 - this.a11 * this.a20;

    const c10 = -(this.a01 * this.a22 - this.a02 * this.a21);
    const c11 = this.a00 * this.a22 - this.a02 * this.a20;
    const c12 = -(this.a00 * this.a21 - this.a01 * this.a20);

    const c20 = this.a01 * this.a12 - this.a02 * this.a11;
    const c21 = -(this.a00 * this.a12 - this.a02 * this.a10);
    const c22 = this.a00 * this.a11 - this.a01 * this.a10;

    return new Matrix3(
      c00, c10, c20,
      c01, c11, c21,
      c02, c12, c22
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

  /**
   * Función que devuelve la matriz en un arreglo unidimensional.
   * @return {Array}
   */
  toArray() {
    return [
      this.a00, this.a01, this.a02,
      this.a10, this.a11, this.a12,
      this.a20, this.a21, this.a22
    ];
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

/** 
 * La clase Vector4 representa vectores de cuadro componentes, x, y, z y w. 
 */
class Vector4 {

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {Number} w
   */
  constructor(x=0, y=0, z=0, w=0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Función que devuelve la suma de sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Vector4}
   */
  static add(u, v) {
    return new Vector4(u.x + v.x, u.y + v.y, u.z + v.z, u.w + v.w);
  }

  /**
   * Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde el cual se invocó la función.
   * @return {Vector4}
   */
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  /**
   * Función que devuelve la distancia euclidiana que hay entre sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Number}
   */
  static distance(u, v) {
    const dx = u.x - v.x;
    const dy = u.y - v.y;
    const dz = u.z - v.z;
    const dw = u.w - v.w;

    return Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
  }

  /**
   * Función que devuelve el producto punto de sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Number}
   */
  static dot(u, v) {
    return u.x*v.x + u.y*v.y + u.z*v.z + u.w*v.w;
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente iguales (con una epsilon = 0.000001) y falso en caso contrario.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Boolean}
   */
  static equals(u, v) {
    return (
      Math.abs(u.x - v.x) < epsilon &&
      Math.abs(u.y - v.y) < epsilon &&
      Math.abs(u.z - v.z) < epsilon &&
      Math.abs(u.w - v.w) < epsilon
    );
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean exactamente iguales y falso en caso contrario.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Boolean}
   */
  static exactEquals(u, v) {
    return u.x === v.x && u.y === v.y && u.z === v.z && u.w ===v.w;
  }

  /**
   * Función que devuelve el vector resultado de la normalización del vector que invoca la función.
   * @return {Vector4}
   */
  normalize() {
    const magnitud = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);

    if(magnitud > 0){
      return new Vector4(this.x/magnitud, this.y/magnitud, this.z/magnitud, this.w/magnitud);
    }
    return new Vector4(0,0,0,0);
  }

  /**
   * Función que asigna nuevos valores a los componentes del vector con que se llama.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {Number} w
   */
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Función que devuelve la resta de sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Vector4}
   */
  static subtract(u, v) {
    return new Vector4(u.x - v.x, u.y - v.y, u.z - v.z, u.w - v.w);
  }

  /**
   * Función que devuelve la distancia euclidiana al cuadrado que hay entre sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
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
    this.w = 0;
  }
}

/** 
 * La clase Matrix4 representa matrices de 4 × 4, y nos permitirán representar y construir las transformaciones en tres dimensiones.
 */
class Matrix4 {
  /**
   * @param {number} a00
   * @param {number} a01
   * @param {number} a02
   * @param {number} a03
   * @param {number} a10
   * @param {number} a11
   * @param {number} a12
   * @param {number} a13
   * @param {number} a20
   * @param {number} a21
   * @param {number} a22
   * @param {number} a23
   * @param {number} a30
   * @param {number} a31
   * @param {number} a32
   * @param {number} a33
   */
  constructor(
    a00=1, a01=0, a02=0, a03=0,
    a10=0, a11=1, a12=0, a13=0,
    a20=0, a21=0, a22=1, a23=0,
    a30=0, a31=0, a32=0, a33=1
  ) {
    this.a00 = a00;
    this.a01 = a01;
    this.a02 = a02;
    this.a03 = a03;
    this.a10 = a10;
    this.a11 = a11;
    this.a12 = a12;
    this.a13 = a13;
    this.a20 = a20;
    this.a21 = a21;
    this.a22 = a22;
    this.a23 = a23;
    this.a30 = a30;
    this.a31 = a31;
    this.a32 = a32;
    this.a33 = a33;
  }

  /**
   * Función que devuelve la suma de dos matrices.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Matrix4}
   */
  static add(m1, m2) {
    return new Matrix4(
      m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02, m1.a03 + m2.a03,
      m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12, m1.a13 + m2.a13,
      m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22, m1.a23 + m2.a23,
      m1.a30 + m2.a30, m1.a31 + m2.a31, m1.a32 + m2.a32, m1.a33 + m2.a33,
    )
  }

  /**
   * Función que devuelve la matriz adjunta (o matriz de cofactores), de la matriz con que se invoca la función.
   * @return {Matrix4}
   */
  adjoint() {
    const c00 = this.a11 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a12 * (this.a21 * this.a33 - this.a23 * this.a31) + this.a13 * (this.a21 * this.a32 - this.a22 * this.a31);
    const c01 = -(this.a10 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a12 * (this.a20 * this.a33 - this.a23 * this.a30) + this.a13 * (this.a20 * this.a32 - this.a22 * this.a30));
    const c02 = this.a10 * (this.a21 * this.a33 - this.a23 * this.a31) - this.a11 * (this.a20 * this.a33 - this.a23 * this.a30) + this.a13 * (this.a20 * this.a31 - this.a21 * this.a30);
    const c03 = -(this.a10 * (this.a21 * this.a32 - this.a22 * this.a31) - this.a11 * (this.a20 * this.a32 - this.a22 * this.a30) + this.a12 * (this.a20 * this.a31 - this.a21 * this.a30));
  
    const c10 = -(this.a01 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a02 * (this.a21 * this.a33 - this.a23 * this.a31) + this.a03 * (this.a21 * this.a32 - this.a22 * this.a31));
    const c11 = this.a00 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a02 * (this.a20 * this.a33 - this.a23 * this.a30) + this.a03 * (this.a20 * this.a32 - this.a22 * this.a30);
    const c12 = -(this.a00 * (this.a21 * this.a33 - this.a23 * this.a31) - this.a01 * (this.a20 * this.a33 - this.a23 * this.a30) + this.a03 * (this.a20 * this.a31 - this.a21 * this.a30));
    const c13 = this.a00 * (this.a21 * this.a32 - this.a22 * this.a31) - this.a01 * (this.a20 * this.a32 - this.a22 * this.a30) + this.a02 * (this.a20 * this.a31 - this.a21 * this.a30);
  
    const c20 = this.a01 * (this.a12 * this.a33 - this.a13 * this.a32) - this.a02 * (this.a11 * this.a33 - this.a13 * this.a31) + this.a03 * (this.a11 * this.a32 - this.a12 * this.a31);
    const c21 = -(this.a00 * (this.a12 * this.a33 - this.a13 * this.a32) - this.a02 * (this.a10 * this.a33 - this.a13 * this.a30) + this.a03 * (this.a10 * this.a32 - this.a12 * this.a30));
    const c22 = this.a00 * (this.a11 * this.a33 - this.a13 * this.a31) - this.a01 * (this.a10 * this.a33 - this.a13 * this.a30) + this.a03 * (this.a10 * this.a31 - this.a11 * this.a30);
    const c23 = -(this.a00 * (this.a11 * this.a32 - this.a12 * this.a31) - this.a01 * (this.a10 * this.a32 - this.a12 * this.a30) + this.a02 * (this.a10 * this.a31 - this.a11 * this.a30));
  
    const c30 = -(this.a01 * (this.a12 * this.a23 - this.a13 * this.a22) - this.a02 * (this.a11 * this.a23 - this.a13 * this.a21) + this.a03 * (this.a11 * this.a22 - this.a12 * this.a21));
    const c31 = this.a00 * (this.a12 * this.a23 - this.a13 * this.a22) - this.a02 * (this.a10 * this.a23 - this.a13 * this.a20) + this.a03 * (this.a10 * this.a22 - this.a12 * this.a20);
    const c32 = -(this.a00 * (this.a11 * this.a23 - this.a13 * this.a21) - this.a01 * (this.a10 * this.a23 - this.a13 * this.a20) + this.a03 * (this.a10 * this.a21 - this.a11 * this.a20));
    const c33 = this.a00 * (this.a11 * this.a22 - this.a12 * this.a21) - this.a01 * (this.a10 * this.a22 - this.a12 * this.a20) + this.a02 * (this.a10 * this.a21 - this.a11 * this.a20);
  
    return new Matrix4(
      c00, c10, c20, c30,
      c01, c11, c21, c31,
      c02, c12, c22, c32,
      c03, c13, c23, c33
    );
  }

  /**
   * Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde el cual se invocó la función.
   * @return {Matrix4}
   */
  clone() {
    return new Matrix4(
      this.a00, this.a01, this.a02, this.a03,
      this.a10, this.a11, this.a12, this.a13,
      this.a20, this.a21, this.a22, this.a23,
      this.a30, this.a31, this.a32, this.a33
    );
  }

  /**
   * Función que devuelve el determinante de la matriz.
   * @return {Number}
   */
  determinant()  {
    return (
      this.a00 * (this.a11 * (this.a22 * this.a33 - this.a23 * this.a32) -
                  this.a12 * (this.a21 * this.a33 - this.a23 * this.a31) +
                  this.a13 * (this.a21 * this.a32 - this.a22 * this.a31)) -
  
      this.a01 * (this.a10 * (this.a22 * this.a33 - this.a23 * this.a32) -
                  this.a12 * (this.a20 * this.a33 - this.a23 * this.a30) +
                  this.a13 * (this.a20 * this.a32 - this.a22 * this.a30)) +
  
      this.a02 * (this.a10 * (this.a21 * this.a33 - this.a23 * this.a31) -
                  this.a11 * (this.a20 * this.a33 - this.a23 * this.a30) +
                  this.a13 * (this.a20 * this.a31 - this.a21 * this.a30)) -
  
      this.a03 * (this.a10 * (this.a21 * this.a32 - this.a22 * this.a31) -
                  this.a11 * (this.a20 * this.a32 - this.a22 * this.a30) +
                  this.a12 * (this.a20 * this.a31 - this.a21 * this.a30))
    );
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente iguales (con una epsilon = 0.000001) y falso en caso contrario.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Boolean}
   */
  static equals(m1, m2) {
    return (
      Math.abs(m1.a00 - m2.a00) < epsilon && Math.abs(m1.a01 - m2.a01) < epsilon && Math.abs(m1.a02 - m2.a02) < epsilon && Math.abs(m1.a03 - m2.a03) < epsilon &&
      Math.abs(m1.a10 - m2.a10) < epsilon && Math.abs(m1.a11 - m2.a11) < epsilon && Math.abs(m1.a12 - m2.a12) < epsilon && Math.abs(m1.a13 - m2.a13) < epsilon &&
      Math.abs(m1.a20 - m2.a20) < epsilon && Math.abs(m1.a21 - m2.a21) < epsilon && Math.abs(m1.a22 - m2.a22) < epsilon && Math.abs(m1.a23 - m2.a23) < epsilon &&
      Math.abs(m1.a30 - m2.a30) < epsilon && Math.abs(m1.a31 - m2.a31) < epsilon && Math.abs(m1.a32 - m2.a32) < epsilon && Math.abs(m1.a33 - m2.a33) < epsilon
    );
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean exactamente iguales y falso en caso contrario.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Boolean}
   */
  static exactEquals(m1, m2) {
    return (
      m1.a00 === m2.a00 && m1.a01 === m2.a01 && m1.a02 === m2.a02 && m1.a03 === m2.a03 &&
      m1.a10 === m2.a10 && m1.a11 === m2.a11 && m1.a12 === m2.a12 && m1.a13 === m2.a13 &&
      m1.a20 === m2.a20 && m1.a21 === m2.a21 && m1.a22 === m2.a22 && m1.a23 === m2.a23 &&
      m1.a30 === m2.a30 && m1.a31 === m2.a31 && m1.a32 === m2.a32 && m1.a33 === m2.a33 
    );
  }

  /**
   * Función que construye una matriz que representa la pirámide truncada (view frustum), determinada por los planos dados por los parámetros left, right, bottom, top, near y far.
   * @param {Number} left
   * @param {Number} right
   * @param {Number} bottom
   * @param {Number} top
   * @param {Number} near
   * @param {Number} far
   * @return {Matrix4}
   */
  static frustum(left, right, bottom, top, near, far) {
    return new Matrix4(
      2*near/(right-left), 0, (right+left)/(right-left), 0,
      0, 2*near/(top-bottom), (top+bottom)/(top-bottom), 0,
      0, 0, -(far+near)/(far-near), -(2*near*far)/(far-near),
      0, 0, -1, 0
    )
  }

  /**
   * Función que devuelve los valores de la matriz identidad.
   */
  static identity() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  /**
   * Función que devuelve la matriz inversa de la matriz con la que se invocó la función.
   * @return {Matrix4}
   */
  invert() {
    const det = this.determinant();

    if(det === 0){
      throw new Error("La matriz no tiene inversa");
    }

    const adj = this.adjoint();
    return Matrix4.multiplyScalar(adj,1/det);
  }

  /**
   * Función que devuelve la matriz de vista a partir de la posición del ojo (eye) el centro de interés (center) y el vector hacia arriba (up).
   * @param {Vector3} eye
   * @param {Vector3} center
   * @param {Vector3} up
   * @return {Matrix4}
   */
  static lookAt(eye, center, up) {
    const w = Vector3.subtract(eye, center).normalize();
    const u = Vector3.cross(up, w).normalize();
    const v = Vector3.cross(w,u).normalize();

    const base = new Matrix4(
      u.x, u.y, u.z, 0,
      v.x, v.y, v.z, 0,
      w.x, w.y, w.z, 0,
      0,   0,   0,   1
    );

    const trans = new Matrix4(
      1, 0, 0, -eye.x,
      0, 1, 0, -eye.y,
      0, 0, 1, -eye.z,
      0, 0, 0, 1
    );

    return this.multiply(base,trans);
  }

  /**
   * Función que devuelve la multiplicación de dos matrices.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Matrix4}
   */
  static multiply(m1, m2) {
    return new Matrix4(
      m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20 + m1.a03 * m2.a30,
      m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21 + m1.a03 * m2.a31,
      m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22 + m1.a03 * m2.a32,
      m1.a00 * m2.a03 + m1.a01 * m2.a13 + m1.a02 * m2.a23 + m1.a03 * m2.a33,
      m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20 + m1.a13 * m2.a30,
      m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21 + m1.a13 * m2.a31,
      m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22 + m1.a13 * m2.a32,
      m1.a10 * m2.a03 + m1.a11 * m2.a13 + m1.a12 * m2.a23 + m1.a13 * m2.a33,
      m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20 + m1.a23 * m2.a30,
      m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21 + m1.a23 * m2.a31,
      m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22 + m1.a23 * m2.a32,
      m1.a20 * m2.a03 + m1.a21 * m2.a13 + m1.a22 * m2.a23 + m1.a23 * m2.a33,
      m1.a30 * m2.a00 + m1.a31 * m2.a10 + m1.a32 * m2.a20 + m1.a33 * m2.a30,
      m1.a30 * m2.a01 + m1.a31 * m2.a11 + m1.a32 * m2.a21 + m1.a33 * m2.a31,
      m1.a30 * m2.a02 + m1.a31 * m2.a12 + m1.a32 * m2.a22 + m1.a33 * m2.a32,
      m1.a30 * m2.a03 + m1.a31 * m2.a13 + m1.a32 * m2.a23 + m1.a33 * m2.a33
    );
  
  }

  /**
   * Función que devuelve una matriz que es el resultado de multiplicar cada componente por un escalar.
   * @param {Matrix4} m1
   * @param {Number} c
   * @return {Matrix4}
   */
  static multiplyScalar(m1, c) {
    return new Matrix4(
      m1.a00 * c, m1.a01 * c, m1.a02 * c, m1.a03 * c,
      m1.a10 * c, m1.a11 * c, m1.a12 * c, m1.a13 * c,
      m1.a20 * c, m1.a21 * c, m1.a22 * c, m1.a23 * c,
      m1.a30 * c, m1.a31 * c, m1.a32 * c, m1.a33 * c
    );
  }

  /**
   * Función que devuelve el vector resultado de multiplicar el vector v por la matriz con que se llama la función. Esta función es la que se va a llamar cuando se apliquen las transformaciones sobre los vectores.
   * @param {Vector4} v
   * @return {Vector4}
   */
  multiplyVector(v) {
    const x = this.a00 * v.x + this.a01 * v.y + this.a02 * v.z + this.a03 * v.w;
    const y = this.a10 * v.x + this.a11 * v.y + this.a12 * v.z + this.a13 * v.w;
    const z = this.a20 * v.x + this.a21 * v.y + this.a22 * v.z + this.a23 * v.w;
    const w = this.a30 * v.x + this.a31 * v.y + this.a32 * v.z + this.a33 * v.w;

    return new Vector4(x, y, z, w);
  }

  /**
   * Función que devuelve una matriz que corresponde a una proyección ortogonal, determinada por los planos dados por los parámetros left, right, bottom, top, near y far.
   * @param {Number} left
   * @param {Number} right
   * @param {Number} bottom
   * @param {Number} top
   * @param {Number} near
   * @param {Number} far
   * @return {Matrix4}
   */
  static orthographic(left, right, bottom, top, near, far) {
    return new Matrix4(
      2/(right-left), 0,       0,       -(right+left)/(right-left),
      0,       2/(top-bottom), 0,       -(top+bottom)/(top-bottom),
      0,       0,       2/(near-far),  (far+near)/(near-far),
      0,       0,       0,        1
    );
  }

  /**
   * Función que devuelve una matriz que corresponde a una proyección en perspectiva. El parámetro fovy corresponde al campo de visión vertical (field of view), el parámetro aspect corresponde a la relación de aspecto, near es la distancia del plano más cercano y far es la distancia del plano más lejano.
   * @param {Number} fovy
   * @param {Number} aspect
   * @param {Number} near
   * @param {Number} far
   * @return {Matrix4}
   */
  static perspective(fovy, aspect, near, far) {
    const c = 1 / Math.tan(fovy/2);

    return new Matrix4(
      c/aspect, 0,  0,            0,
      0,        c,  0,            0,
      0,        0, -(far+near)/(far-near), -(2*near*far)/(far-near),
      0,        0, -1,            0
    );
  }

  /**
   * Función que devuelve una matriz de rotación en 3D sobre el eje X con el ángulo (en radianes) dado por el parámetro theta.
   * @param {Number} theta
   * @return {Matrix4}
   */
  static rotateX(theta) {
    const c = Math.cos(theta);
    const s = Math.cos(theta);

    return new Matrix4(
      1, 0,  0, 0,
      0, c, -s, 0,
      0, s,  c, 0,
      0, 0,  0, 1
    );
  }

  /**
   * Función que devuelve una matriz de rotación en 3D sobre el eje Y con el ángulo (en radianes) dado por el parámetro theta.
   * @param {Number} theta
   * @return {Matrix4}
   */
  static rotateY(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    return new Matrix4(
      c, 0, s, 0,
      0, 1, 0, 0,
     -s, 0, c, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Función que devuelve una matriz de rotación en 3D sobre el eje Z con el ángulo (en radianes) dado por el parámetro theta.
   * @param {Number} theta
   * @return {Matrix4}
   */
  static rotateZ(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    return new Matrix4(
      c, -s, 0, 0,
      s,  c, 0, 0,
      0,  0, 1, 0,
      0,  0, 0, 1
    )
  }

  /**
   * Función que devuelve una matriz de escalamiento en 3D con los factores de escala determinados por las componentes del vector v.
   * @param {Vector3} v
   * @return {Matrix4}
   */
  static scale(v) {
    return new Matrix4(
      v.x, 0, 0, 0,
      0, v.y, 0, 0,
      0, 0, v.z, 0,
      0, 0, 0 ,  1
    )

  }

  /**
   * Función que asigna nuevos valores a los componentes de la matriz con que se llama.
   * @param {Number} a00
   * @param {Number} a01
   * @param {Number} a02
   * @param {Number} a03
   * @param {Number} a10
   * @param {Number} a11
   * @param {Number} a12
   * @param {Number} a13
   * @param {Number} a20
   * @param {Number} a21
   * @param {Number} a22
   * @param {Number} a23
   * @param {Number} a30
   * @param {Number} a31
   * @param {Number} a32
   * @param {Number} a33
   */
  set(
    a00=0, a01=0, a02=0, a03=0, 
    a10=0, a11=0, a12=0, a13=0, 
    a20=0, a21=0, a22=0, a23=0, 
    a30=0, a31=0, a32=0, a33=0
  ) {
    this.a00 = a00;
    this.a01 = a01;
    this.a02 = a02;
    this.a03 = a03;
    this.a10 = a10;
    this.a11 = a11;
    this.a12 = a12;
    this.a13 = a13;
    this.a20 = a20;
    this.a21 = a21;
    this.a22 = a22;
    this.a23 = a23;
    this.a30 = a30;
    this.a31 = a31;
    this.a32 = a32;
    this.a33 = a33;
  }

  /**
   * Función que sustrae componente a componente la matriz m2 de la matriz m1.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Matrix4}
   */
  static subtract(m1, m2) {
    return new Matrix4(
      m1.a00 - m2.a00, m1.a01 - m2.a01, m1.a02 - m2.a02, m1.a03 - m2.a03,
      m1.a10 - m2.a10, m1.a11 - m2.a11, m1.a12 - m2.a12, m1.a13 - m2.a13,
      m1.a20 - m2.a20, m1.a21 - m2.a21, m1.a22 - m2.a22, m1.a23 - m2.a23,
      m1.a30 - m2.a30, m1.a31 - m2.a31, m1.a32 - m2.a32, m1.a33 - m2.a33
    );
  }

  /**
   * Función que devuelve una matriz de traslación en 3D con los factores de desplazamiento dados por las componentes del vector v.
   * @param {Vector3} v
   * @return {Matrix4}
   */
  static translate(v) {
    return new Matrix4(
      1, 0, 0, v.x,
      0, 1, 0, v.y,
      0, 0, 1, v.z,
      0, 0, 0, 1
    )
  }

  /**
   * Función que devuelve la matriz transpuesta de la matriz desde donde se invocó la función.
   * @return {Matrix4}
   */
  transpose() {
    return new Matrix4(
      this.a00, this.a10, this.a20, this.a30,
      this.a01, this.a11, this.a21, this.a31,
      this.a02, this.a12, this.a22, this.a32,
      this.a03, this.a13, this.a23, this.a33
    );
  }

  /**
   * Función que devuelve la matriz en un arreglo unidimensional.
   * @return {Array}
   */
  toArray() {
    return [
      this.a00, this.a01, this.a02, this.a03,
      this.a10, this.a11, this.a12, this.a13,
      this.a20, this.a21, this.a22, this.a23,
      this.a30, this.a31, this.a32, this.a33
    ];
  }
}
