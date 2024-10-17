f();
function f() {
  console.log("hola desde la función f");
}

//g(); // desde aquí no funciona la función no esta definida
var g = function() {
  console.log("hola desde la función g");
};
g(); // desde aquí si funciona

//h();
let h = () => {
  console.log("hola desde la función h");
};
h();