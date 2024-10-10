// Se puede crear un arreglo vacío directamente con la notación de corchetes
let arreglo_1 = [];
console.log(arreglo_1);

// Se puede crear un arreglo con elementos directamente con la notación de corchetes
let arreglo_2 = ["hola", 2, true, {x:0, y:0}, 'adiós'];
console.log(arreglo_2);

// También existe una clase Array y podemos usar su constructor
// esto es equivalente a let arreglo_3 = [];
let arreglo_3 = new Array();
console.log(arreglo_3);

// Usar el constructor Array es útil cuando se quiere construir un arreglo con un tamaño determinado
let arreglo_4 = new Array(15);
console.log(arreglo_4);

// Si el argumento del constructor Array no es un solo número, entonces el constructor crear un arreglo con los parámetros que se le pasa, en este caso se obtiene ["hola"]
let arreglo_5 = new Array("hola");
console.log(arreglo_5);

// En este caso se crea ["hola", 2, true, {x:0, y:0}, 'adiós']
let arreglo_6 = new Array("hola", 2, true, {x:0, y:0}, 'adiós');
console.log(arreglo_6);

// Los arreglos proporcionan su tamaño con la variable length
console.log("el tamaño de arreglo_6 es", arreglo_6.length);


/** Funciones sobre arreglos */
let val = 0;
let A = [1, 2, 3, 4, 2, 5];
console.log(A);

// La función estática isArray devuelve true si el parámetro es un arreglo y false en caso contrario
/** Array.isArray */
console.log(Array.isArray(A), Array.isArray(val));

// La función push agrega uno o varios elementos al final del arreglo
A.push(6);
console.log(A);

// La función pop quita el último elemento del arreglo y lo devuelve como valor
val = A.pop();
console.log(A, "---->", val);

// La función unshift agrega uno o varios elementos al inicio del arreglo
A.unshift(10);
console.log(A);

// La función shift quita el primer elemento del arreglo y lo devuelve como valor
val = A.shift();
console.log(A, "---->", val);

// La función indexOf devuelve el indice del primer elemento que sea igual al parámetro que recibe
// en el caso de que el elemento no exista dentro del arreglo, entonces devuelve -1
val = A.indexOf(2);
console.log(val);

val = A.indexOf(10);
console.log(val);

// La función lastIndexOf devuelve el indice del último elemento que sea igual al parámetro que recibe
// en el caso de que el elemento no exista dentro del arreglo, entonces devuelve -1
val = A.lastIndexOf(2);
console.log(val);

val = A.lastIndexOf(10);
console.log(val);

// La función splice(startIndex, numElementsToDelete, elementosAInsertar) inserta e elimina valores en el arreglo
// Los elementos a insertar pueden ser varios elementos
// El parámetro startIndex indica el indice dentro del arreglo donde se van a agregar elementos
// El parámetro numElementsToDelete indica cuantos elementos se van a borrar a partir del indice de inicio (startIndex)

// En este ejemplo a partir del indice 2, borrando 0 elementos, se agregan los elementos 101 y 102 al arreglo
A.splice(2, 0, 101, 102);
console.log(A);

// En este ejemplo a partir del indice 3 se borran dos elementos
A.splice(3, 2);
console.log(A);


// La función forEach recibe como parámetro una función que se va a ejecutar por cada elemento del arreglo
A.forEach(function(item, index, array) {
  console.log(`item = ${item}, index = ${index}, array = ${array}`);
});

// Si no es necesario saber el indice o modificar los elementos del arreglo y se quiere iterar sobre todos los elementos, se puede usar for of
for (let elemento of A) {
  console.log("elemento: ", elemento);
}

// La función some recibe una función con la que se prueba si algunos de los elementos del arreglo cumplen con alguna condición
val = A.some(function(item, index, array) {
  if (item > 3) {
    return true;
  }
  else {
    return false;
  }
});
console.log("some :", val);

// La función every recibe una función con la que se prueba si todos los elementos del arreglo cumplen con alguna condición
val = A.every(function(item, index, array) {
  if (item > 0) {
    return true;
  }
  else {
    return false;
  }
});
console.log("every: ", val);

// La función find recibe una función con la que se prueba si algún elemento del arreglo cumple con la condición determinada, si se cumple devuelve el valor del elemento y si no se cumple devuelve undefined
val = A.find(function(item, index, array) {
  if (item >= 3) {
    return true;
  }
  else {
    return false;
  }
});
console.log("find: ", val);

// La función findIndex recibe una función con la que se prueba si algún elemento del arreglo cumple con la condición determinada, si se cumple devuelve el indice del elemento y si no se cumple devuelve -1
val = A.findIndex(function(item, index, array) {
  return (item >= 3);
});
console.log("findIndex: ", val);

// La función filter recibe una función con la que se construye un nuevo arreglo con los elementos que cumplan la condición dada en la función
val = A.filter(function(item, index, array) {
  return (item >= 3);
});
console.log("filter: ", val);

// La función map recibe una función que se ejecuta sobre cada elemento del arreglo y el resultado obtenido se utiliza para construir un nuevo arreglo
val = A.map(function(item, index, array) {
  return item * 3;
});
console.log("map: ", val, "arreglo original: ", A);

// La función reduce recibe una función que se ejecuta sobre cada elemento y el resultado se va acumulando para devolver un único resultado
val = A.reduce(function(accumulator, currentValue, index, array) {
  return accumulator + currentValue;
}, 0);
console.log("reduce: ", val);

// La función concat sirve para concatenar dos arreglos
val = A.concat([10, 6, 9, 8, 7]);
console.log("concat: ", val);

// La función fill(val, inicio, fin) reemplaza con el valor val los elementos que se encuentran en el rango determinado por inicio y fin
A.fill(-1, 0, 2);
console.log("fill: ", A);

// La función reverse invierte los valores de los elementos del arreglo
A.reverse();
console.log("reverse: ", A);


A = [10, 3, -1, 5, 102, -10, 8, 23];

// La función sort ordena los valores del arreglo, si los elementos son números estos se ordenan de mayor a menor; si son cadenas se ordenan de mayor a menor lexicográficamente; si son objetos generales los ordena respecto al resultado que se obtiene al hacer toString(), es decir, lo ordena por medio de su representación de cadena
A.sort();
console.log("sort: ", A);

// La función sort puede recibir una función como argumento y en esta función se pueden definir la forma en la que se comparan dos valores; esto es útil para ordenar objetos dado alguno de sus atributos
A.sort(function(a, b) {
  if (a < b) 
    return -1;
  else if (a > b)
    return 1;
  else
    return 0;
});
console.log("sort: ", A);

// La función join toma los valores del arreglo y los convierte a cadena devolviendo la concatenación de dichas cadenas
console.log("join: ", A.join());

// Si se le pasa una cadena como parámetro a la función join, esta cadena se concatena entra cada elemento
console.log("join: ", A.join(" @ "));
