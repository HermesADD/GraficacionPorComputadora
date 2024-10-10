let per1 = new Persona("Mario", 23);
let per2 = new Persona("Luigi", 26);
let cyb1 = new Cyborg("Edward", 20, 0.25);
let cyb2 = new Cyborg("Alphonse", 18, 1);

console.log(per1);
console.log(per2);
console.log(cyb1);
console.log(cyb2);

console.log(per1.saludo());
console.log(per2.saludo());
console.log(cyb1.saludo());
console.log(cyb2.saludo());

console.log("El número de personas es: " + Persona.cuantasPersonas());
// console.log(Persona.contador_personas);
