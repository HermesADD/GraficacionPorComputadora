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
      const MOVE_STEP = 0.05; // Incremento para theta/phi
      const ZOOM_STEP = 10;  // Incremento para el radio

      switch (evt.key) {
        case "ArrowUp": // Mover hacia arriba
          this.phi = Math.min(this.phi + MOVE_STEP, Math.PI / 2 - 0.01);
          break;
        case "ArrowDown": // Mover hacia abajo
          this.phi = Math.max(this.phi - MOVE_STEP, -Math.PI / 2 + 0.01);
          break;
        case "ArrowLeft": // Girar a la izquierda
          this.theta += MOVE_STEP;
          break;
        case "ArrowRight": // Girar a la derecha
          this.theta -= MOVE_STEP;
          break;
        case "+": // Acercar
          this.radius = Math.max(this.radius - ZOOM_STEP, 250); // No permitir acercarse demasiado
          break;
        case "-": // Alejar
          this.radius = Math.min(this.radius + ZOOM_STEP, 2500); // No permitir alejarse demasiado
          break;
      }

      this.updatePosition();
      draw_callback(); // Redibuja la escena con la nueva posición de la cámara
    });
  }
}
