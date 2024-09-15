let epsilon = 0.000001;

/** 
 * La clase Vector3 representa vectores de tres componentes, x, y y z.
 */
class Vector3 {
  /**
   * COLOCAR AQUÍ LO DESARROLLADO EN LA PRÁCTICA ANTERIOR
   */
}


/** 
 * La clase Matrix3 representa matrices de 3 × 3. Y se utilizará para la representación y construcción de transformaciones en dos dimensiones.
 */
class Matrix3 {
  /**
   * COLOCAR AQUÍ LO DESARROLLADO EN LA PRÁCTICA ANTERIOR
   */
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

  }

  /**
   * Función que devuelve la suma de sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Vector4}
   */
  static add(u, v) {

  }

  /**
   * Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde el cual se invocó la función.
   * @return {Vector4}
   */
  clone() {

  }

  /**
   * Función que devuelve la distancia euclidiana que hay entre sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Number}
   */
  static distance(u, v) {

  }

  /**
   * Función que devuelve el producto punto de sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Number}
   */
  static dot(u, v) {

  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente iguales (con una epsilon = 0.000001) y falso en caso contrario.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Boolean}
   */
  static equals(u, v) {

  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean exactamente iguales y falso en caso contrario.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Boolean}
   */
  static exactEquals(u, v) {

  }

  /**
   * Función que devuelve el vector resultado de la normalización del vector que invoca la función.
   * @return {Vector4}
   */
  normalize() {

  }

  /**
   * Función que asigna nuevos valores a los componentes del vector con que se llama.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {Number} w
   */
  set(x, y, z, w) {

  }

  /**
   * Función que devuelve la resta de sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Vector4}
   */
  static subtract(u, v) {

  }

  /**
   * Función que devuelve la distancia euclidiana al cuadrado que hay entre sus argumentos.
   * @param {Vector4} u
   * @param {Vector4} v
   * @return {Number}
   */
  static squaredDistance(u, v) {

  }

  /**
   * Función que asigna cero a cada componente del vector que invoca la función.
   */
  zero() {

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

  }

  /**
   * Función que devuelve la suma de dos matrices.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Matrix4}
   */
  static add(m1, m2) {

  }

  /**
   * Función que devuelve la matriz adjunta (o matriz de cofactores), de la matriz con que se invoca la función.
   * @return {Matrix4}
   */
  adjoint() {

  }

  /**
   * Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde el cual se invocó la función.
   * @return {Matrix4}
   */
  clone() {

  }

  /**
   * Función que devuelve el determinante de la matriz.
   * @return {Number}
   */
  determinant()  {

  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente iguales (con una epsilon = 0.000001) y falso en caso contrario.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Boolean}
   */
  static equals(m1, m2) {

  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean exactamente iguales y falso en caso contrario.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Boolean}
   */
  static exactEquals(m1, m2) {

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

  }

  /**
   * Función que asigna los valores de la matriz identidad a la matriz desde donde se invocó la función.
   */
  identity() {

  }

  /**
   * Función que devuelve la matriz inversa de la matriz con la que se invocó la función.
   * @return {Matrix4}
   */
  invert() {

  }

  /**
   * Función que devuelve la matriz de vista a partir de la posición del ojo (eye) el centro de interés (center) y el vector hacia arriba (up).
   * @param {Vector3} eye
   * @param {Vector3} center
   * @param {Vector3} up
   * @return {Matrix4}
   */
  static lookAt(eye, center, up) {

  }

  /**
   * Función que devuelve la multiplicación de dos matrices.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Matrix4}
   */
  static multiply(m1, m2) {

  }

  /**
   * Función que devuelve una matriz que es el resultado de multiplicar cada componente por un escalar.
   * @param {Matrix4} m1
   * @param {Number} c
   * @return {Matrix4}
   */
  static multiplyScalar(m1, c) {

  }

  /**
   * Función que devuelve el vector resultado de multiplicar el vector v por la matriz con que se llama la función. Esta función es la que se va a llamar cuando se apliquen las transformaciones sobre los vectores.
   * @param {Vector4} v
   * @return {Vector4}
   */
  multiplyVector(v) {

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

  }

  /**
   * Función que devuelve una matriz de rotación en 3D sobre el eje X con el ángulo (en radianes) dado por el parámetro theta.
   * @param {Number} theta
   * @return {Matrix4}
   */
  static rotateX(theta) {

  }

  /**
   * Función que devuelve una matriz de rotación en 3D sobre el eje Y con el ángulo (en radianes) dado por el parámetro theta.
   * @param {Number} theta
   * @return {Matrix4}
   */
  static rotateY(theta) {

  }

  /**
   * Función que devuelve una matriz de rotación en 3D sobre el eje Z con el ángulo (en radianes) dado por el parámetro theta.
   * @param {Number} theta
   * @return {Matrix4}
   */
  static rotateZ(theta) {

  }

  /**
   * Función que devuelve una matriz de escalamiento en 3D con los factores de escala determinados por las componentes del vector v.
   * @param {Vector3} v
   * @return {Matrix4}
   */
  static scale(v) {

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

  }

  /**
   * Función que sustrae componente a componente la matriz m2 de la matriz m1.
   * @param {Matrix4} m1
   * @param {Matrix4} m2
   * @return {Matrix4}
   */
  static subtract(m1, m2) {

  }

  /**
   * Función que devuelve una matriz de traslación en 3D con los factores de desplazamiento dados por las componentes del vector v.
   * @param {Vector3} v
   * @return {Matrix4}
   */
  static translate(v) {

  }

  /**
   * Función que devuelve la matriz transpuesta de la matriz desde donde se invocó la función.
   * @return {Matrix4}
   */
  transpose() {

  }
}
