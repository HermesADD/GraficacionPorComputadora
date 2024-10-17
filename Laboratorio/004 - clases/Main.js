let per1 = new Persona("Mario", 23);
let per2 = new Persona("Luigi", 26);

per1.otra_variable = "un valor";
// per1.#variable_privada = "nuevo valor privado";
// per1.#asignarVariableNueva();

console.log(per1);
console.log(per2);

console.log(per1.saludo());
console.log(per2.saludo());

console.log("El número de personas es: " + Persona.cuantasPersonas());
// console.log(Persona.contador_personas);
