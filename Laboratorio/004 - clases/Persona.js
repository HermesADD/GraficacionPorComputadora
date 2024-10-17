class Persona {
  // una variable de clase, es decir, una variable que se comparte entre todas los objetos construidos con esta clase
  static contador_personas = 0;

  // variables de instancia, es decir, variables que tendrán un valor independiente en cada objeto construido
  // NOTA: en JavaScript es usual no declarar las variables de instancia públicas, ya que se pueden iniciar directamente en el constructor
  nombre;
  edad;
  id;
  otra_variable;

  // una variable privada solo accesible desde la clase, esta funcionalidad es relativamente nueva, así que se necesita un navegador actualizado para que funcione
  #variable_privada;

  /**
   * El constructor de la clase Persona
   * @param {String} nombre recibe una cadena con el nombre de la persona
   * @param {Number} edad recibe un número con la edad de la persona
   */
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.id = Persona.contador_personas++;
    this.#variable_privada = this.#asignarVariableNueva();
  }

  /**
   * Función que devuelve una cadena con el saludo de la persona
   * @returns {String}
   */
  saludo() {
    return this.nombre + " dice hola tengo " + this.edad;
  }
  // saludo(texto) {
  //   return this.nombre + " dice " + texto;
  // }

  /**
   * Función privada que devuelve un valor aleatorio
   * @returns {Number}
   */
  #asignarVariableNueva() {
    return Math.random();
  }

  /**
   * Función estática que devuelve el número de personas que se han construido
   * @returns {Number}
   */
  static cuantasPersonas() {
    return Persona.contador_personas;
  }
}