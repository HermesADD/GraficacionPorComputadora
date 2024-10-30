class CuboInvertido extends GenericGeometry {
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
       1,  1,  1, 
       1, -1,  1, 
      -1, -1,  1, 
       1,  1,  1, 
      -1, -1,  1, 
      -1,  1,  1, 

       1,  1, -1, 
       1, -1, -1, 
       1, -1,  1, 
       1,  1, -1, 
       1, -1,  1, 
       1,  1,  1, 
 
      -1,  1, -1, 
      -1, -1, -1, 
       1, -1, -1, 
      -1,  1, -1, 
       1, -1, -1, 
       1,  1, -1, 

      -1,  1,  1, 
      -1, -1,  1, 
      -1, -1, -1, 
      -1,  1,  1, 
      -1, -1, -1, 
      -1,  1, -1,
  
       1, -1,  1, 
       1, -1, -1, 
      -1, -1, -1, 
       1, -1,  1, 
      -1, -1, -1, 
      -1, -1,  1, 

       1,  1, -1, 
       1,  1,  1, 
      -1,  1,  1, 
       1,  1, -1, 
      -1,  1,  1,
      -1,  1, -1, 
    ];
  }
}
