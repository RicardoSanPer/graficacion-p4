
canvas = document.getElementById("the_canvas");
gl = canvas.getContext("webgl");
if(!gl)
{
    throw "WebGL no soportado";
}

//Crear programa
let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

let program = createProgram(gl, vertexShader, fragmentShader);

positionAttributeLocation = gl.getAttribLocation(program, "a_position");
normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
colorUniformLocation = gl.getUniformLocation(program, "u_color");
lightUniformLocation = gl.getUniformLocation(program, "u_light_position");
PVM_matrixLocation = gl.getUniformLocation(program, "u_PVM_matrix");
VM_matrixLocation = gl.getUniformLocation(program, "u_VM_matrix");
ambientColorLocation = gl.getUniformLocation(program, "ambientColor");
CamPosition = gl.getUniformLocation(program, "cameraPos");
specularUniform = gl.getUniformLocation(program, "useSpecular");

texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

textureLocation = gl.getUniformLocation(program, "u_texture");
normalTextureLocation = gl.getUniformLocation(program, "u_normalmap");
specularTextureLocation = gl.getUniformLocation(program, "u_specularmap");

let lightDir = new CG.Vector4(0, 1, 0, 0);
let ambientColor = new CG.Vector3(135/255, 206/255, 235/255);
let usarEspecular = true;

let geometry = [
    new CG.Cilindro(
      gl, 
      [1, 0, 0, 1], 
      2, 2, 16, 0, 
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
      2, 32, 16, 
      CG.Matrix4.translate(new CG.Vector3(-5, 0, 0)),
      "earth.jpg",
      "earth_normal2.jpg",
      "earth_specular.jpg"
    ),
    new CG.Icosaedro(gl, 
      [1, 0 , 1, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(0, 0, 0))
    ),
    new CG.Octaedro(
      gl, 
      [1, 1, 0, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(5, 0, 0))
    ),
    //6
    new CG.PrismaRectangular(
      gl, 
      [1, 0.2, 0.3, 1], 
      3, 3, 3, 
      CG.Matrix4.translate(new CG.Vector3(-5, 0, 5))
    ),
    new CG.Tetraedro(
      gl, 
      [0.5, 0.5, 0.5, 1], 
      2, 
      CG.Matrix4.translate(new CG.Vector3(0, 0, 5))
    ),
    new CG.Toro(
      gl, 
      [0.25, 0.25, 0.25, 1], 
      4, 1, 32, 16, 
      CG.Matrix4.translate(new CG.Vector3(5, 0, 5))
    )
  ];

let camara = new CG.CamaraCOI(canvas, new CG.Vector3(0,0,0));
    
//Dibuja la escena
function draw()
{
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(ambientColor.x,ambientColor.y,ambientColor.z, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);

    camara.updateMatrix();
    let cameraPos = camara.position;

    let lightpos = camara.viewMatrix.multiplyVector(lightDir);
    
    gl.uniform3f(lightUniformLocation, lightpos.x, lightpos.y, lightpos.z);
    gl.uniform3f(ambientColorLocation, ambientColor.x,ambientColor.y,ambientColor.z)
    gl.uniform3f(CamPosition, cameraPos.x, cameraPos.y, cameraPos.z);
    gl.uniform1i(specularUniform, usarEspecular);

    gl.uniform1i(textureLocation, 0);
    gl.uniform1i(normalTextureLocation, 1);
    gl.uniform1i(specularTextureLocation, 2);

    for (let i=0; i<geometry.length; i++) {
        // se dibuja la geometría
        geometry[i].draw(
          gl,
          positionAttributeLocation,
          normalAttributeLocation, 
          colorUniformLocation,
          PVM_matrixLocation,
          VM_matrixLocation,
          camara.projectionMatrix,
          camara.viewMatrix,
          texcoordLocation);
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
//Input
document.addEventListener('keydown', function(event) {
    let angleX = 0;
    let angleY = 0;
    let distance = 0;
    if(event.keyCode == 65) {
        angleX = 6;
    }
    else if(event.keyCode == 68) {
        angleX = -6;
    }
  
    if(event.keyCode == 87) {
      angleY = 6;
    }
    else if(event.keyCode == 83) {
      angleY = -6;
    }
  
    if(event.keyCode == 81)
    {
      distance = 1;
    }
    else if(event.keyCode == 69)
    {
      distance = -1;
    }
    camara.updatePosition(angleX, angleY, distance);
  });

//Bucle de actualizacion
function update(delta)
{
  lightDir.set(Math.cos(counter) * 6,Math.sin(counter) * 6,0);
}

//Bucle de dibujado
function loop(timestamp)
{  
    let delta = (timestamp - lastRender)/ 1000;
    counter += delta;
    camara.Update(delta);
    update(delta);
    draw();
    lastRender = timestamp;

    window.requestAnimationFrame(loop);
}
var lastRender = 0;
var counter = 0;
window.requestAnimationFrame(loop)