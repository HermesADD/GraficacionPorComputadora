/**
 * 
 */
function createProgram(gl, vertexSrc, fragmentSrc) {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexSrc);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return;
  }

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentSrc);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return;
  }

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

/**
 * 
 */
function getMousePositionInElement(evt, element) {
  const rect = element.getBoundingClientRect();
  return { 
    x: evt.clientX - rect.left, 
    y: evt.clientY - rect.top
  };
}

/**
 * 
 */
async function loadText(url) {
  let file = await fetch(url);

  if (file.status === 200) {
    return await file.text();
  }
  else {
    throw new Error(`Error al leer el archivo ${url}, status ${file.status}`);
  }
}

/**
 * 
 */
async function parseObj(filename) {
  let file_content = await loadText(filename);
  let base_dir = filename.substring(0, filename.lastIndexOf("/"));

  // se divide la información del .obj en un arreglo de líneas de texto
  let lines = file_content.split("\n");
  let initial_vertices = [];
  let initial_normals = [];
  let faces = [];
  let group_faces = [];
  let material_library = {};
 
  for (const line of lines) {
    // archivo de materiales
    if (line.startsWith("mtllib")) {
      // se obtienen los diversos parámetros que definen los materiales del .obj
      material_library = await parseMtl( base_dir + "/" + line.split(" ")[1] );
    }

    // se obtiene la información de los vértices
    else if (line.startsWith("v ")) {
      data = line.split(" ");
      data.shift();
      initial_vertices.push(data);
    }

    // se obtiene la información de las normales
    else if (line.startsWith("vn ")) {
      data = line.split(" ");
      data.shift();
      initial_normals.push(data);
    }

    // se obtiene la información de las caras
    else if (line.startsWith("f ")) {
      data = line.split(" ");
      data.shift();

      // cara definida como un triángulo
      if (data.length === 3) {
        faces.push(data);
      }
      // cara definida como un cuadrilátero
      // se agregan dos triángulos
      else if (data.length === 4) {
        faces.push([ data[0], data[1], data[2] ]);
        faces.push([ data[0], data[2], data[3] ]);
      }
    }

    // El grupo de elementos que usan un material particular
    else if (line.startsWith("usemtl ")) {
      group_faces.push({
        mat_name: line.split(" ")[1],
        initial_index: faces.length
      });
    }
  }

  // se agrega al grupo de caras el número total de elementos
  for (let i=0; i<group_faces.length; i++) {
    // los elementos anteriores al último
    if (i+1 < group_faces.length) {
      group_faces[i].num_elements = group_faces[i+1].initial_index - group_faces[i].initial_index;
    }
    // el último elemento
    else {
      group_faces[i].num_elements = faces.length - group_faces[i].initial_index;
    }
  }

  // se aplana la información de los vértices y las normales, para utilizar la representación de triángulos independientes
  let vertices = [];
  let normals = [];
  let tmp1, tmp2, tmp3;

  for(let i=0,l=faces.length; i<l; i++) {
    tmp1 = faces[i][0].split("/");
    tmp2 = faces[i][1].split("/");
    tmp3 = faces[i][2].split("/");

    // Coordenadas de los vértices
    vertices.push(
      // coordenadas del primer vértice
      initial_vertices[parseInt(tmp1[0])-1][0], // x
      initial_vertices[parseInt(tmp1[0])-1][1], // y
      initial_vertices[parseInt(tmp1[0])-1][2], // z
      // coordenadas del segundo vértice
      initial_vertices[parseInt(tmp2[0])-1][0], // x
      initial_vertices[parseInt(tmp2[0])-1][1], // y
      initial_vertices[parseInt(tmp2[0])-1][2], // z
      // coordenadas del tercer vértice
      initial_vertices[parseInt(tmp3[0])-1][0], // x
      initial_vertices[parseInt(tmp3[0])-1][1], // y
      initial_vertices[parseInt(tmp3[0])-1][2], // z
    );
    // Hay que considerar que algunos archivos .obj no estándar codifican los colores en los vertices como una tripleta adicional a la información de los vértices
    // Por ejemplo: "v 1 0 0 0.2 0.3 0.4", representa un vértice con coordenadas x=1, y=0, z=0 y con componentes de color R=0.2, G=0.3 y B=0.4


    // Coordenadas de las normales
    if (tmp1[2]) {
      normals.push(
        // coordenadas de la normal del primer vértice
        initial_normals[parseInt(tmp1[2])-1][0], // x
        initial_normals[parseInt(tmp1[2])-1][1], // y
        initial_normals[parseInt(tmp1[2])-1][2], // z
        // coordenadas de la normal del segundo vértice
        initial_normals[parseInt(tmp2[2])-1][0], // x
        initial_normals[parseInt(tmp2[2])-1][1], // y
        initial_normals[parseInt(tmp2[2])-1][2], // z
        // coordenadas de la normal del tercer vértice
        initial_normals[parseInt(tmp3[2])-1][0], // x
        initial_normals[parseInt(tmp3[2])-1][1], // y
        initial_normals[parseInt(tmp3[2])-1][2], // z
      );
    }
  }

  return {
    vertices: vertices,
    normals: normals,
    group_faces: group_faces,
    material_library: material_library
  }
}

/**
 * 
 */
async function parseMtl(filename) {
  let file_content = await loadText(filename);
  let material_library = {};

  if (file_content) {
    // Nombre del material actual
    let name;
    let tmp;

    // Se divide el contenido del archivo en líneas
    let lines = file_content.split("\n");

    // Se itera sobre cada línea de texto
    for (const line of lines) {
      // Se obtiene el nombre del material
      if (line.startsWith("newmtl ")) {
        name = line.split(" ")[1];
        // Se crea un objeto temporal para almacenar los parámetros del material
        material_library[name] = {};
      }

      // Componente ambiental
      else if (line.startsWith("Ka ")) {
        tmp = line.split(" ");
        material_library[name].Ka = [
          tmp[1], // R
          tmp[2], // G
          tmp[3]  // B
        ];
      }

      // Componente difuso
      else if (line.startsWith("Kd ")) {
        tmp = line.split(" ");
        material_library[name].Kd = [
          tmp[1], // R
          tmp[2], // G
          tmp[3]  // B
        ];
      }

      // Componente especular
      else if (line.startsWith("Ks ")) {
        tmp = line.split(" ");
        material_library[name].Ks = [
          tmp[1], // R
          tmp[2], // G
          tmp[3]  // B
        ];
      }

      // Exponente especular (shininess)
      else if (line.startsWith("Ns ")) {
        tmp = line.split(" ");
        material_library[name].shininess = tmp[1];
      }
    }
  }

  return material_library;
}