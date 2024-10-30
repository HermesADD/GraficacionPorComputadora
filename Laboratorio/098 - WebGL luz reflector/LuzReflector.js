class LuzReflector {
  constructor(pos={x:0,y:0,z:0}, dir={x:0,y:0,z:0}, ambient=[0.2,0.2,0.2], diffuse=[1,1,1], especular=[1,1,1], quadratic=1, linear=0, constant=0, cut_off=Math.PI/2, fall_off=5) {
    this.position = pos;
    this.direction = dir;
    this.direction.w = 0;

    this.ambient = ambient;
    this.diffuse = diffuse;
    this.especular = especular;
    this.quadratic = quadratic;
    this.linear = linear;
    this.constant = constant;
    this.cut_off = cut_off;
    this.fall_off = fall_off;

    this.position_transform = {x:0,y:0,z:0};
    this.direction_transform = {x:0,y:0,z:0};
  }

  update(viewMatrix) {
    this.position_transform = multiplyVector(viewMatrix, this.position);

    this.direction_transform = multiplyVector(viewMatrix, this.direction);
  }

  getPosition() {
    return [this.position_transform.x, this.position_transform.y, this.position_transform.z];
  }

  getDirection() {
    return [this.direction_transform.x, this.direction_transform.y, this.direction_transform.z];
  }
}
