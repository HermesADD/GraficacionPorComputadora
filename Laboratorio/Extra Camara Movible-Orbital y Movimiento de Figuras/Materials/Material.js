let materialCache = {};

class Material {
  constructor(gl, color, vertexShaderSource, fragmentShaderSource) {
    this.color = color;

    // this.constructor.name contiene el nombre de la clase del objeto, en particular los nombres de las clases que extienden a Material cuando se construyen
    // Se verifica si el nombre existe en el objeto materialCache para evitar construir muchos shaders iguales, en lugar de eso si existe el material se reutiliza, esto es importante por que cada material creado debe almacenarse y compilarse en la GPU y hay que evitar crear programas (shaders) de más
    if (materialCache[this.constructor.name]) {
      this.program = materialCache[this.constructor.name];
    }
    // Si el material no se encuentra en el objeto materialCache, es necesario crearlo y agregarlo
    else {
      materialCache[this.constructor.name] = createProgram(gl, vertexShaderSource, fragmentShaderSource);
      this.program = materialCache[this.constructor.name];
    }

    this.attributes = this.getAttributesList(gl);
    this.uniforms = this.getUniformsList(gl);
  }

  /**
   * Función que obtiene todos los atributos activos del programa (conjunto de shader de vértices y fragmentos)
   */
  getAttributesList(gl) {
    // Los atributos se almacenan en un objeto por nombre para que sea más fácil su acceso
    let attributes = {};
    let tmp_attribute_name;

    // Se itera uno a uno sobre todos los atributos activos en el shader
    for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES); i<l; i++) {
      // Se obtiene el nombre del atributo
      tmp_attribute_name = gl.getActiveAttrib(this.program, i).name;

      // En el objeto que va a almacenar los atributos se guarda la referencia devuelta por el programa con la función getAttribLocation
      attributes[tmp_attribute_name] = gl.getAttribLocation(this.program, tmp_attribute_name);
    }

    return attributes;
  }

  /**
   * Función que obtienen todos los uniformes activos del programa
   */
  getUniformsList(gl) {
    // Los uniformes se almacenan en un objeto por nombre para facilitar su acceso
    let uniforms = {};
    let tmp_uniform_name;

    // Se itera sobre los uniformes activos
    for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS); i<l; i++) {
      // Se obtiene el nombre del uniforme
      tmp_uniform_name = gl.getActiveUniform(this.program, i).name;

      // Se almacena la referencia al uniforme obtenido por nombre con la función getUniformLocation
      uniforms[tmp_uniform_name] = gl.getUniformLocation(this.program, tmp_uniform_name);
    }

    return uniforms;
  }

  /** 
   * Función que devuelve el atributo por nombre, en caso de que no se encuentre devuelve undefined
   */
  getAttribute(name) {
    return this.attributes[name];
  }

  /** 
   * Función que devuelve el uniforme por nombre, en caso de que no se encuentre devuelve undefined
   */
  getUniform(name) {
    return this.uniforms[name];
  }
}
