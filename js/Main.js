// se obtiene una referencia al canvas
let canvas = document.getElementById("the_canvas");

// se obtiene una referencia al contexto de render de WebGL
const gl = canvas.getContext("webgl");

if (!gl) throw "WebGL no soportado";

  // se obtiene una referencia al elemento con id="2d-vertex-shader" que se encuentra en el archivo index.html
  let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
  // con el contenido leído, se crea un shader utilizando la función de utilería "createShader"
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  // se obtiene una referencia al elemento con id="2d-fragment-shader" que se encuentra en el archivo index.html
  let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
  // con el contenido leído, se crea un shader utilizando la función de utilería "createShader"
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // se crea el programa que se enviara a la tarjeta de video, el cual está compuesto por los dos shader que se crearon anteriormente
  let program = createProgram(gl, vertexShader, fragmentShader);

  // se construye una referencia al attribute "a_position" definido en el shader
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
  let colorUniformLocation = gl.getUniformLocation(program, "u_color");
  let lightUniformLocation = gl.getUniformLocation(program, "u_light_position");
  let PVM_matrixLocation = gl.getUniformLocation(program, "u_PVM_matrix");
  let VM_matrixLocation = gl.getUniformLocation(program, "u_VM_matrix");

   // si el navegador no soporta WebGL la variable gl no está definida y se lanza una excepción
  
   let posicionLuz = new CG.Vector3(0, 0, 2);

  // se crean y posicionan los modelos geométricos, uno de cada tipo
  let geometry = [
    new CG.Cilindro(
      gl, 
      [1, 0, 0, 1], 
      2, 2, 16, 16, 
      CG.Matrix4.translate(new CG.Vector3(-5, 0, -5))
    ),
    new CG.Cono(
      gl, 
      [0, 1, 0, 1], 
      2, 2, 16, 16, 
      CG.Matrix4.translate(new CG.Vector3(0, 0, -5))
    ),
    new CG.Dodecaedro(
      gl, 
      [0, 0, 1, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(5, 0, -5))
    ),
    new CG.Esfera(
      gl, 
      [0, 1, 1, 1], 
      2, 16, 16, 
      CG.Matrix4.translate(new CG.Vector3(-5, 0, 0))
    ),
    new CG.Icosaedro(gl, 
      [1, 0 , 1, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(0, 0, 0))
    ),/*
    new CG.Octaedro(
      gl, 
      [1, 1, 0, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(5, 0, 0))
    ),*/
    new CG.PrismaRectangular(
      gl, 
      [1, 0.2, 0.3, 1], 
      2, 3, 4, 
      CG.Matrix4.translate(new CG.Vector3(-5, 0, 5))
    ),
    /*
    new CG.Tetraedro(
      gl, 
      [0.5, 0.5, 0.5, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(0, 0, 5))
    ),
    new CG.Toro(
      gl, 
      [0.25, 0.25, 0.25, 1], 
      4, 1, 16, 16, 
      CG.Matrix4.translate(new CG.Vector3(5, 0, 5))
    ),*/
  ];

  // Activar o desactivar wireframe
  let verWireframe = false;
  //Rotacion 1
  var angleX = 90;
  var angleY = 45;
  var distance = 11;

  // se define la posición de la cámara (o el observador o el ojo)
  let camera = new CG.Vector3(0, 0, distance);
  updateCamera();
  // se define la posición del centro de interés, hacia donde observa la cámara
  let coi = new CG.Vector3(0, 0, 0);
  // se crea una matriz de cámara (o vista)
  let viewMatrix = CG.Matrix4.lookAt(camera, coi, new CG.Vector3(0, 1, 0));

  // se construye la matriz de proyección en perspectiva
  let projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);;

  // se define una matriz que combina las transformaciones de la vista y de proyección
  let viewProjectionMatrix = CG.Matrix4.multiply(projectionMatrix, viewMatrix);

  

window.addEventListener("load", function(evt) {
  // se dibujan los objetos
  draw();

});

/**Obtiene teclas presionadas para rotar la camara */
document.addEventListener('keydown', function(event) {
  if(event.keyCode == 65) {
      angleX += 6;
  }
  else if(event.keyCode == 68) {
      angleX -= 6;
  }
  angleX = (angleX > 360)? angleX - 360 : (angleX < 0)? angleX + 360 : angleX;

  if(event.keyCode == 87) {
    angleY += 6;
  }
  else if(event.keyCode == 83) {
    angleY -= 6;
  }
  angleY = (angleY > 90)? 90 : (angleY < -90) ? -90 : angleY;

  if(event.keyCode == 81)
  {
    distance += 1;
  }
  else if(event.keyCode == 69)
  {
    distance -= 1;
  }
  distance = (distance < 0)? 0 : distance;

  if(event.keyCode == 32)
  {
    verWireframe = !verWireframe;
  }

  updateCamera();
  
  updateView();
});

/**Actualiza la posicion de la camara */
function updateCamera()
{
  var angle = Math.PI / 180;
  let x = Math.cos(angleY * angle) * Math.cos(angleX * angle) * distance;
  let y = Math.sin(angleY * angle) * distance;
  let z = Math.cos(angleY * angle) * Math.sin(angleX * angle) * distance;
  let displacement = new CG.Vector3(x,y,z);
  camera = displacement;
}

/**Actualiza las matrices de vista */
function updateView()
{
  viewMatrix = CG.Matrix4.lookAt(camera, coi, new CG.Vector3(0, 1, 0));
  projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);
  viewProjectionMatrix = CG.Matrix4.multiply(projectionMatrix, viewMatrix);
  draw();
}

// se encapsula el código de dibujo en una función
function draw() {
  // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
  gl.enable(gl.DEPTH_TEST);

  // se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // se determina el color con el que se limpia la pantalla, en este caso un color negro transparente
  gl.clearColor(0, 0, 0, 0);

  // se limpian tanto el buffer de color, como el buffer de profundidad
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // se le indica a WebGL que programa debe utilizar
  // recordando, un programa en este contexto es una pareja compuesta por un shader de vértices y uno de fragmento

  // como todos los objetos que vamos a dibujar usan el mismo par de shader podemos usar esta función fuera del siguiente for
  // pero si cada objeto geométrico tiene su propio estilo podemos cambiar el programa dentro del for dependiendo del modelo
  gl.useProgram(program);
  
  let posCamaraTransformada = projectionMatrix.multiplyVector(posicionLuz);

  gl.uniform3f(lightUniformLocation, posicionLuz.x, posicionLuz.y, posicionLuz.z);
  for (let i=0; i<geometry.length; i++) {
    // se dibuja la geometría
    geometry[i].draw(
      gl,
      positionAttributeLocation,
      normalAttributeLocation, 
      colorUniformLocation,
      PVM_matrixLocation,
      VM_matrixLocation,
      projectionMatrix,
      viewMatrix);
      if(verWireframe)
      {
        geometry[i].drawWireframe();
      }
  }
}

//////////////////////////////////////////////////////////
// Funciones de utilería para la construcción de shaders
//////////////////////////////////////////////////////////
/**
 * Función que crear un shader, dado un contexto de render, un tipo y el código fuente
 */
function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Función que toma un shader de vértices con uno de fragmentos y construye un programa
 */
function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
}