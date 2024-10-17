/**
 * Transformación de rotación respecto al eje Y
 */
function rotateY(rad) {
  let c = Math.cos(rad);
  let s = Math.sin(rad);

  return [
     c, 0, s, 0,
     0, 1, 0, 0,
    -s, 0, c, 0,
     0, 0, 0, 1
  ];
}

/**
 * Multiplicación de una matriz con un vector
 */
function multiplyVector(M, v) {
  if (v.w == undefined) {
    v.w = 1;
  }

  return {
    x: M[0]*v.x  + M[1]*v.y  + M[2]*v.z  + M[3]*v.w,
    y: M[4]*v.x  + M[5]*v.y  + M[6]*v.z  + M[7]*v.w,
    z: M[8]*v.x  + M[9]*v.y  + M[10]*v.z + M[11]*v.w,
    w: M[12]*v.x + M[13]*v.y + M[14]*v.z + M[15]*v.w,
  };
}