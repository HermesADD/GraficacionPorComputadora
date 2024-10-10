let per1 = new Persona("Mario", 23);
let per2 = new Persona("Luigi", 26);

console.log(per1);
console.log(per2);
console.log(per1.saludo());
console.log(per2.saludo());

per1.nombreDeUnaNuevaVariable = 12345;
console.log("Valor de la variable privada " + per1.nombreDeUnaNuevaVariable)

console.log("El número de personas es: " + Persona.cuantasPersonas());
// console.log(Persona.contador_personas);
