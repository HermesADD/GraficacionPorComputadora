class Plano extends GenericGeometry {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl), transform=identity()) {
    super(gl, material, transform);

    this.init(gl);
  }

  /**
   */
   getVertices() {
    return [
      1, 0,  1,
      1, 0, -1,
     -1, 0,  1,

     -1, 0,  1,
      1, 0, -1,
     -1, 0, -1
    ];
  }
}
