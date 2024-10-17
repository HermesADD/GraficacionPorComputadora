// Las cadenas se pueden definir con comillas dobles
let str_1 = "una cadena";
console.log(str_1);

// Las cadenas se pueden definir con comillas sencillas
let str_2 = 'otra cadena';
console.log(str_2);

// Las cadenas se pueden definir con el acento inverso
let str_3 = `también una cadena`;
console.log(str_3);

// El operador + sirve para concatenar las cadenas, solo hay que tener cuidado con el uso de comillas dobles o sencillas dentro de la cadena
let str_4 = "primera 'parte' " + 'segunda "parte"';
console.log(str_4);

// Si se quiere usar una cadena que utilice tanto comillas dobles como sencillas, se puede usar el acento inverso
let str_5 = `primera 'parte' segunda "parte"`;
console.log(str_5);

let valor = 123;
let str_6 = "el valor es " + valor;
console.log(str_6);

// Al usar el acento inverso para una cadena se tiene la posibilidad de reemplazar la concatenación de valores con el operador +; usando en su lugar la notación ${UN_VALOR}
// NOTA: la notación ${UN_VALOR} solo funciona con la cadenas definidas con el acento inverso
let str_7 = `el valor es ${valor}`;
console.log(str_7);

// Una ventaja adicional con las cadenas definidas con el acento inverso es que se pueden incluir saltos de linea directamente
console.log(`el tamaño de 
str7 es ${str_7.length}`);

// Se puede construir una cadena con su constructor, con lo que se puede convertir algún elemento a su representación en cadena
let str_8 = new String(9876543210);
console.log(str_8);

// El constructor utiliza en caso de estar definida, la función toString del objeto
let str_9 = (9876543210).toString();
console.log(str_9);

// Es posible comparar lexicográficamente dos cadenas con los operadores < y >
console.log(`${str_1} < ${str_3} = `, str_1 < str_3);
console.log(`${str_1} > ${str_3} = `, str_1 > str_3);

// Se puede acceder a los caracteres individuales de la cadena con la notación de corchetes o se puede utilizar la función charAt para acceder a un carácter particular
console.log(str_1[0], str_1.charAt(0));

// La función concat concatena dos cadenas y funciona de forma similar al operador +
console.log("concat: ", str_1.concat(str_2));
console.log("+: ", str_1 + str_2);

// La función includes busca en la cadena el parámetro que se le pasa y si se encuentra devuelve true, sino devuelve false
console.log("includes: ", str_4.includes("parte"));

// La función startsWith verifica si la cadena inicia con el parámetro que se le pasa y si inicia con esa cadena devuelve true, sino devuelve false
console.log("startsWith: ", str_4.startsWith("primera"));

// La función endsWith verifica si la cadena termina con el parámetro que se le pasa y si termina con esa cadena devuelve true, sino devuelve false
console.log("endsWith: ", str_4.endsWith("final"));

// La función indexOf busca el parámetro como una subcadena y devuelve el indice de la primera aparición, o -1 en caso de que no se encuentre
console.log("indexOf: ", str_4.indexOf("'"));

// La función lastIndexOf busca el parámetro como una subcadena y devuelve el indice de la ultima aparición, o -1 en caso de que no se encuentre
console.log("lastIndexOf: ", str_4.lastIndexOf("'"));

// La función repeat recibe un número de veces que se va a replicar la cadena con la que se llama
console.log("repeat: ", "0".repeat(100));

// La función slice construye una subcadena considerando los indices que recibe como parámetros; si no se le pasa un valor al segundo parámetro se considera la longitud de la cadena
console.log("slice: ", str_4.slice(5));
console.log("slice: ", str_4.slice(10, 16));

// La función substring funciona igual que la función slice
console.log("substring: ", str_4.substring(5));
console.log("substring: ", str_4.substring(10, 16));

// La función split devuelve un arreglo cuyos elementos son subcadenas obtenidas al partir la cadena original con el parámetro que recibe
console.log("split: ", str_4.split(" "));

// La función toLowerCase crea una nueva cadena con todos sus caracteres en minúsculas
console.log("toLowerCase: ", str_4.toLowerCase());

// La función toUpperCase crea una nueva cadena con todos sus caracteres en mayúsculas
console.log("toUpperCase: ", str_4.toUpperCase());

// La función trim remueve los espacios en blanco al inicio y al final de la cadena
console.log("trim: ", str_4.trim());
