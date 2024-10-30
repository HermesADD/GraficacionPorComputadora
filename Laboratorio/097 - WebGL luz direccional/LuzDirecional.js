class LuzDirecional {
  constructor(dir={x:0,y:0,z:0}, ambient=[0.2,0.2,0.2], diffuse=[1,1,1], especular=[1,1,1]) {
    this.direction = dir;
    // como la dirección de la luz es un vector, para realizar la multiplicación correctamente es necesario que tenga la componente w=0; de lo contrario la dirección se transforma de forma incorrecta el mover la cámara
    this.direction.w = 0;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.especular = especular;
    this.direction_transform = {x:0,y:0,z:0};
  }

  update(viewMatrix) {
    this.direction_transform = multiplyVector(viewMatrix, this.direction);
  }

  getDirection() {
    return [this.direction_transform.x, this.direction_transform.y, this.direction_transform.z];
  }
}
