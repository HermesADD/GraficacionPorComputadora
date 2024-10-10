// En JavaScript no es necesario crear una clase para construir un objeto
// Esto se logra con la notación de objetos de JavaScript (JavaScript Object Notation, JSON)
// Aquí se construye un objeto con dos atributos: "id" y "value"; y se les asigna los valores "obj_1_id" y 4, respectivamente
// El objeto se almacena en la variable obj_1
let obj_1 = {
  id: "obj_1_id",
  value: 4,
};
console.log(obj_1);

// Los objetos son muy flexibles, ya que se pueden agregar atributos en cualquier momento, no solo en tiempo de construcción
obj_1.color = "#ff3311";
obj_1.position = {x: 0, y:0};

console.log(obj_1);

// Es posible acceder a los atributos de un objeto por medio de la notación punto (obj.atributo)
console.log("id =",       obj_1.id);
console.log("value =",    obj_1.value);
console.log("color =",    obj_1.color);
console.log("position =", obj_1.position);
console.log("no_esta =",  obj_1.no_esta);

// Pero también se puede acceder a los atributos de un objeto por medio de la notación de corchetes, como si fuera un arreglo, donde en lugar de usar un número se utiliza el nombre del atributo como cadena (obj["atributo"])
console.log("id =",       obj_1["id"]);
console.log("value =",    obj_1["value"]);
console.log("color =",    obj_1["color"]);
console.log("position =", obj_1["position"]);
console.log("no_esta =",  obj_1["no_esta"]);
