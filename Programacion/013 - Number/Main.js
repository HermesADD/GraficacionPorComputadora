console.log("Number.EPSILON :", Number.EPSILON);

console.log("Number.MAX_SAFE_INTEGER :", Number.MAX_SAFE_INTEGER);

console.log("Number.MIN_SAFE_INTEGER :", Number.MIN_SAFE_INTEGER);

console.log("Number.MAX_VALUE :", Number.MAX_VALUE);

console.log("Number.MIN_VALUE :", Number.MIN_VALUE);

console.log("Number.NaN :", Number.NaN);

console.log("Number.NEGATIVE_INFINITY :", Number.NEGATIVE_INFINITY);

console.log("Number.POSITIVE_INFINITY :", Number.POSITIVE_INFINITY);

console.log("Infinity :", Infinity);


let str_1 = "123.456";
let str_2 = "ff";
let str_3 = "10100";
let x = Math.PI;
let y = NaN;
let z = Infinity;
let w = 17;

/** isNaN */
console.log(`isNaN(${x}) : ${isNaN(x)}`);
console.log(`isNaN(${y}) : ${isNaN(y)}`);

/** isFinite */
console.log(`isFinite(${x}) : ${isFinite(x)}`);
console.log(`isFinite(${z}) : ${isFinite(z)}`);

/** Number.isInteger */
console.log(`Number.isInteger(${x}) : ${Number.isInteger(x)}`);
console.log(`Number.isInteger(${w}) : ${Number.isInteger(w)}`);

/** Number.isSafeInteger */
console.log(`Number.isSafeInteger(${w}) : ${Number.isSafeInteger(w)}`);
console.log(`Number.isSafeInteger(${z}) : ${Number.isSafeInteger(z)}`);

/** Number.parseFloat o parseFloat */
console.log(`parseFloat(${str_1}) : ${parseFloat(str_1)}`);
console.log(`Number.parseFloat(${str_1}) : ${Number.parseFloat(str_1)}`);

/** Number.parseInt o parseInt */
console.log(`parseInt(${str_1}) : ${parseInt(str_1)}`);
console.log(`parseInt(${str_2}, 16) : ${parseInt(str_2, 16)}`);
console.log(`parseInt(${str_3}, 2) : ${parseInt(str_3, 2)}`);

/** toExponential */
console.log(`(${x}).toExponential(3) : ${(x).toExponential(3)}`);

/** toFixed */
console.log(`(${x}).toFixed(20) : ${(x).toFixed(20)}`);

/** Number */
console.log(`Number("123") : ${Number("123")}`);
console.log(`Number("3.45") : ${Number("3.45")}`);
console.log(`Number("78e-5") : ${Number("78e-5")}`);
console.log(`Number("") : ${Number("")}`);
console.log(`Number(null) : ${Number(null)}`);
console.log(`Number("0x11") : ${Number("0x11")}`);
console.log(`Number("0b11") : ${Number("0b11")}`);
console.log(`Number("0o11") : ${Number("0o11")}`);
console.log(`Number("Hola") : ${Number("Hola")}`);
console.log(`Number("100px") : ${Number("100px")}`);
console.log(`Number({x:10}) : ${Number({x:10})}`);
console.log(`Number(undefined) : ${Number(undefined)}`);
