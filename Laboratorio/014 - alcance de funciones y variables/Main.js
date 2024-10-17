// Cuando se escriben funciones de esta forma, las variables (en este caso la función saludo) es parte del ambiente global en particular el ambiente global se encuentra en la variable window
function saludo() {
  console.log("hola");
}

let holaStr = "hola";
function otroSaludo() {
  console.log("otro " + holaStr);
}
window.otroSaludo = otroSaludo;

// Es posible observar que las funciones saludo(), otroSaludo() y la variable holaStr, son parte del objeto window
console.log(window);

// El alcance desde donde se pueden acceder a funciones y variables usualmente se limita por llaves {}
function muestraElAlcance() {
  // Esta variable solo es accesible dentro de esta función
  let variable_interna = 123;
}
muestraElAlcance();
// esto causa un error ya que la variable variable_interna no esta definida en este ambiente
// console.log(variable_interna)


// Usualmente este es comportamiento esperado en lenguajes como Java, pero en JavaScript se pueden crear ambientes (environment) para limitar el alcance de las variables solo con las llaves
{
  // Esta es una función que se asigna a una variable, pero como esta dentro de un par de llaves, la función no es accesible en el global
  let unaFuncionQueNoEsGlobal = function () {
    console.log("hola");
  }
  function otraFuncionPeroEstaSiEsGlobal() {
    console.log("HOLA");
  }
}
// esto causa un error ya que al definir la función unaFuncionQueNoEsGlobal con let, esta es una variable limitada al alcance de las llaves superiores que la contienen
// unaFuncionQueNoEsGlobal();
otraFuncionPeroEstaSiEsGlobal()