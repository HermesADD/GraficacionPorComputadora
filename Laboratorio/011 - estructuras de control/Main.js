let i;
let n = 10;
let arr = ["a", "b", "c", "d"];
let obj = {x:1, y:-1};
let str = "beeblebrox";

console.log("---- if ----");
/** if */
if (n < 100) {
  console.log("n es menor que 100");
}

console.log("---- if-else ----");
/** if-else */
if (n < 10) {
  console.log("n es menor que 10");
}
else {
  console.log("n es mayor o igual que 10");
}

console.log("---- if-else-2 ----");
/** if-else 2 */
if (obj) {
  console.log("el valor es DIFERENTE a: '', 0, false, undefined, null");
}
else {
  console.log("el valor es IGUAL a: '', 0, false, undefined, null");
}

console.log("---- if-else if-else ----");
/** if-else if-else */
if (n < 10)
  console.log("n es menor que 10");
else if (n === 10)
  console.log("n es igual que 10");
else 
  console.log("n es mayor que 10");

console.log("---- ()?: ----");
/** if ternario */
console.log( (n < 10) ? "n es menor que 10" : "n no es menor que 10" );

console.log("---- switch ----");
/** switch */
switch(n) {
  case 1: 
    console.log("el valor es 1");
    break;
  case 10:
    console.log("el valor es 10");
    break;
  default:
    console.log("ninguno de los anteriores");
    break;
}

console.log("---- while ----");
/** while */
i = 0;
while(i < 3) {
  console.log("while: el valor de i es ", i++);
}

console.log("---- do-while ----");
/** do-while */
i = 0;
do {
  console.log("do-while: el valor de i es ", i++);
} while(i < 3);


console.log("---- for ----");
/** for */
for (i=0; i<3; i++) {
  console.log("for: el valor de i es ", i);
}

console.log("---- for-of ----");
/** for-of */
for (let ele of arr) {
  console.log("for-of:", ele);
}


/** try-catch */
try {
  f(3);  
}
catch(err) {
  console.log("ERROR en el try:", err);
}
console.log("hola después del try-catch");