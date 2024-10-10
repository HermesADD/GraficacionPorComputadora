/**
 * Clase que representa una matriz de 3x3
 */
class Matriz {
  constructor(a11 = 0, a12 = 0, a13 = 0, a21 = 0, a22 = 0, a23 = 0, a31 = 0, a32 = 0, a33 = 0) {
    this.a11 = a11;
    this.a12 = a12;
    this.a13 = a13;

    this.a21 = a21;
    this.a22 = a22;
    this.a23 = a23;

    this.a31 = a31;
    this.a32 = a32;
    this.a33 = a33;

    this.vectorZero = new Vector();
  }
}

/**
 * Clase que representa un vector 2D
 */
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
