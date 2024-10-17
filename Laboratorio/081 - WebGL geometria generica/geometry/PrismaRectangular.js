class PrismaRectangular extends GenericGeometry {
  /**
   */
  constructor(gl, width=1, height=1, length=1, color="#ffffff", transform=identity()) {
    super(gl, color, transform);

    this.w = width;
    this.h = height;
    this.l = length;

    // Se obtienen los vértices y se construyen los buffers de datos correspondientes
    this.init(gl);
  }

  /**
   */
  getVertices() {
    return [
       this.w/2,  this.h/2, -this.l/2,  
       this.w/2, -this.h/2,  this.l/2,  
       this.w/2, -this.h/2, -this.l/2,

       this.w/2,  this.h/2, -this.l/2,  
       this.w/2,  this.h/2,  this.l/2,  
       this.w/2, -this.h/2,  this.l/2,

       this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,

       this.w/2, -this.h/2,  this.l/2,  
       this.w/2,  this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2,

      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,

      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2,  this.h/2, -this.l/2,

      -this.w/2,  this.h/2, -this.l/2,  
       this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,

      -this.w/2,  this.h/2, -this.l/2,  
       this.w/2,  this.h/2, -this.l/2,  
       this.w/2, -this.h/2, -this.l/2,

      -this.w/2,  this.h/2,  this.l/2,  
       this.w/2,  this.h/2, -this.l/2, 
      -this.w/2,  this.h/2, -this.l/2,

      -this.w/2,  this.h/2,  this.l/2,  
       this.w/2,  this.h/2,  this.l/2,  
       this.w/2,  this.h/2, -this.l/2,

       this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,

       this.w/2, -this.h/2, -this.l/2,  
       this.w/2, -this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,
    ];
  }
}
