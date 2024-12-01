class OrbitCamera {

  constructor(pos = new Vector3(0, 0, 1), coi = new Vector3(0, 0, 0), up = new Vector3(0, 1, 0)) {
    this.pos = pos;
    this.coi = coi;
    this.up = up;

    this.radius = Vector3.distance(this.pos, this.coi);
    let direction = Vector3.subtract(this.pos, this.coi);

    this.theta = Math.atan2(direction.z, direction.x);
    this.phi = Math.asin(direction.y / this.radius);
  }

  /** Calcula la matriz de vista */
  getMatrix() {
    return Matrix4.lookAt(this.pos, this.coi, this.up);
  }

  /** Ajusta la posición de la cámara basándose en theta, phi y el radio */
  updatePosition() {
    this.pos = new Vector3(
      this.coi.x + this.radius * Math.cos(this.phi) * Math.cos(this.theta),
      this.coi.y + this.radius * Math.sin(this.phi),
      this.coi.z + this.radius * Math.cos(this.phi) * Math.sin(this.theta)
    );
  }

  /** Registra eventos de teclado para controlar la cámara */
  registerKeyEvents(canvas, draw_callback) {
    window.addEventListener("keydown", (evt) => {
      const MOVE_STEP = 0.05;
      const ZOOM_STEP = 10;  

      switch (evt.key) {
        case "ArrowUp": 
          this.phi = Math.min(this.phi + MOVE_STEP, Math.PI / 2 - 0.01);
          break;
        case "ArrowDown": 
          this.phi = Math.max(this.phi - MOVE_STEP, -Math.PI / 2 + 0.01);
          break;
        case "ArrowLeft": 
          this.theta += MOVE_STEP;
          break;
        case "ArrowRight": 
          this.theta -= MOVE_STEP;
          break;
        case "+": 
          this.radius = Math.max(this.radius - ZOOM_STEP, 250); 
          break;
        case "-": 
          this.radius = Math.min(this.radius + ZOOM_STEP, 2500); 
          break;
      }

      this.updatePosition();
      draw_callback();
    });
  }
}
