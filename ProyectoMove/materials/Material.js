let materialCache = {};

class Material {
  /**
   * Constructor de la clase Material
   * @param gl - Contexto WebGL donde se utiliza este material.
   * @param color - Color asociado al material.
   * @param vertexShaderSource - Código fuente del shader de vértices.
   * @param fragmentShaderSource - Código fuente del shader de fragmentos.
   */
  constructor(gl, color, vertexShaderSource, fragmentShaderSource) {
    this.color = color;

    if (materialCache[this.constructor.name]) {
      this.program = materialCache[this.constructor.name];
    }
    else {
      materialCache[this.constructor.name] = createProgram(gl, vertexShaderSource, fragmentShaderSource);
      this.program = materialCache[this.constructor.name];
    }

    this.attributes = this.getAttributesList(gl);
    this.uniforms = this.getUniformsList(gl);
  }

  /**
   * Obtiene la lista de atributos activos en el programa WebGL.
   * @param gl - Contexto WebGL.
   * @returns Los nombres de los atributos como claves y sus ubicaciones como valores.
   */
  getAttributesList(gl) {
    let attributes = {};
    let tmp_attribute_name;

    for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES); i<l; i++) {
      tmp_attribute_name = gl.getActiveAttrib(this.program, i).name;
      attributes[tmp_attribute_name] = gl.getAttribLocation(this.program, tmp_attribute_name);
    }

    return attributes;
  }

  /**
   * Obtiene la lista de uniformes activos en el programa WebGL.
   * @param gl - Contexto WebGL.
   * @returns Los nombres de los uniformes como claves y sus ubicaciones como valores.
   */
  getUniformsList(gl) {
    let uniforms = {};
    let tmp_uniform_name;

    for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS); i<l; i++) {
      tmp_uniform_name = gl.getActiveUniform(this.program, i).name;
      uniforms[tmp_uniform_name] = gl.getUniformLocation(this.program, tmp_uniform_name);
    }

    return uniforms;
  }

  /**
   * Obtiene la ubicación de un atributo específico.
   * @param name - Nombre del atributo.
   * @returns Ubicación del atributo en el programa WebGL.
   */
  getAttribute(name) {
    return this.attributes[name];
  }

  /**
   * Obtiene la ubicación de un uniforme específico.
   * @param name - Nombre del uniforme.
   * @returns  Ubicación del uniforme en el programa WebGL.
   */
  getUniform(name) {
    return this.uniforms[name];
  }
}
