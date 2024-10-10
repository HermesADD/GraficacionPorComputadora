/**
 * Función que lee un archivo de texto, utiliza promesas de forma síncrona
 * @param {String} url dirección del archivo a cargar
 * @returns devuelve el contenido del archivo
 */
async function loadText(url) {
  // la función fetch crea una promesa de carga del archivo especificado por la url, al usar await se espera a que la promesa sea resuelta haciendo que la carga del archivo sea síncrona
  let file = await fetch(url);

  // Un valor de 200 en la variable status indica que el archivo se obtuvo correctamente
  if (file.status === 200) {
    // el archivo obtenido contiene la información encapsulada y es necesario extraerla, para eso se usa la función text que también devuelve una promesa por lo que de nuevo se utiliza await para esperar a que termine de ejecutarse
    return await file.text();
  }
  // En caso de que no se haya logrado obtener el archivo, ya sea porque se escribió mal el nombre, o el archivo no se encuentre donde se espera; se lanza una excepción para indicar que ocurrió un error al cargar el archivo y la excepción debe ser manejada desde el lugar donde se llama la función loadText
  else {
    throw new Error(`Error al leer el archivo ${url}, status ${file.status}`);
  }
}