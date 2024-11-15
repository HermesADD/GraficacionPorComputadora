class OrbitCamera {

  constructor(pos={x:0, y:0, z:1}, coi={x:0, y:0, z:0}, up={x:0, y:1, z:0}) {
    this.pos = pos;
    this.coi = coi;
    this.up = up;

    this.radius = distance(this.pos, this.coi);
    let direction = subtract(this.pos, this.coi);

    this.theta = Math.atan2(direction.z, direction.x);
    this.phi = Math.atan2(direction.y, direction.z);
  }

  /** */
  getMatrix() {
    return lookAt(this.pos, this.coi, this.up)
  }

  /** */
  finishMove(init_mouse, current_mouse) {
    let angles = this.getAngles(init_mouse, current_mouse);

    this.theta = angles.theta;
    this.phi   = angles.phi;
  }

  /** */
  rotate(init_mouse, current_mouse) {
    let angles = this.getAngles(init_mouse, current_mouse);

    this.pos = {
      x: this.coi.x + this.radius * Math.cos(angles.phi) * Math.cos(angles.theta), 
      y: this.coi.y + this.radius * Math.sin(angles.phi), 
      z: this.coi.z + this.radius * Math.cos(angles.phi) * Math.sin(angles.theta)
    };
  }

  /** */
  getAngles(init_mouse, current_mouse) {
    const EPSILON = 0.01;

    let theta = this.theta + (current_mouse.x - init_mouse.x)/100;

    let phi = Math.min(
      Math.max(
        this.phi + (current_mouse.y - init_mouse.y)/100,
        -Math.PI/2 +EPSILON
      ),
      Math.PI/2 -EPSILON
    );

    return {
      theta : theta,
      phi   : phi
    };
  }

  /** */
  moveForward() {
    let dir = normalize(subtract(this.coi, this.pos));
    this.pos = add(this.pos, dir);
    this.coi = add(this.coi, dir);
   
  }
  /** */
  moveBackward() {
    let dir = normalize(subtract(this.coi, this.pos));
    this.pos = subtract(this.pos, dir);
    this.coi = subtract(this.coi, dir);
  }

  /** */
  registerMouseEvents(canvas, draw_callback) {
    let initial_mouse_position = null;

    canvas.addEventListener("mousedown", (evt) => {
      initial_mouse_position = getMousePositionInElement(evt, canvas);
      window.addEventListener("mousemove", mousemove);
    });

    window.addEventListener("mouseup", (evt) => {
      if (initial_mouse_position != null) {
        this.finishMove(initial_mouse_position, getMousePositionInElement(evt, canvas));
        window.removeEventListener("mousemove", mousemove);
      }
      initial_mouse_position = null;
    });

    let mousemove = (evt) => {
      this.rotate(initial_mouse_position, getMousePositionInElement(evt, canvas));
      draw_callback();
    } 
  }
}
