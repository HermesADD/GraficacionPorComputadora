class Cyborg extends Persona {
  variable_del_cyborg = "soy un cyborg";

  /**
   * El constructor de la clase Cyborg
   * @param {String} nombre recibe una cadena con el nombre de la persona
   * @param {Number} edad recibe un número con la edad de la persona
   * @param {Number} porcentaje_robotico recibe la cantidad de partes robóticas por partes humanas
   */
  constructor(nombre, edad, porcentaje_robotico) {
    // la función super corresponde al constructor de la clase padre, en este caso Persona
    // es obligatorio llamar a esta función cuando se usa extends
    super(nombre, edad);

    // la modificación de variables de instancia para subclases tiene que hacerse después de llamar a super
    // es decir, cualquier uso de this antes de la llamada a la función super causa un error

    this.porcentaje_robotico = porcentaje_robotico;
  }

  /**
   * Función que devuelve una cadena con el saludo del Cyborg
   * Esta función sustituye la definición de saludo() de la clase Persona
   * @returns {String}
   */
  saludo() {
    return this.nombre + " dice hola mi edad es " + this.edad + " y tengo " + (this.porcentaje_robotico*100) + "% de partes robóticas";
  }
}