let canvas = document.getElementById("the_canvas");
let renderer = new CG.Renderer();
let isCanvasFocus = false;
let mousePreviousPos = [0,0];
let mouseVector = [0,0];
const overlay = document.getElementById('overlay');

//Input
document.addEventListener('keydown', function(event) {
  if(isCanvasFocus)
  {
    if(event.key == 'Escape' && isCanvasFocus) {
      canvas.blur();
      isCanvasFocus = false;
      document.body.style.cursor = "auto";
      overlay.style.display = "none";
    }
    else if(event.key == 'e')
    {
      renderer.camara.updatePosition(0,0,0.5);
    }
    else if(event.key == 'q')
    {
      renderer.camara.updatePosition(0,0,-0.5);
    }
  }
    
  });

function setCanvasFocus() 
{
  if(!isCanvasFocus)
  {
    canvas.focus();
    isCanvasFocus = true;
    document.body.style.cursor = "none";
    overlay.style.display = "block";
  }
}

function handleMouseMove(event) {
  if (isCanvasFocus) {
      mouseVector[0] = event.clientX - mousePreviousPos[0];
      mouseVector[1] = event.clientY - mousePreviousPos[1];
      //console.log(mouseVector);
  }
  mousePreviousPos[0] = event.clientX;
  mousePreviousPos[1] = event.clientY;  
}

// Event listener for mouse movement
document.addEventListener('mousemove', handleMouseMove);

function changeLightPosX(value)
{
  renderer.lightDir.updatePosition(value);
}

function changeLightPosY(value)
{
  renderer.lightDir.updatePosition(null,value);
}

//Bucle de actualizacion
function update(delta)
{
  renderer.lightDir.Update(delta);
}

//Bucle de dibujado
function loop(timestamp)
{  
    let delta = (timestamp - lastRender)/ 1000;
    counter += delta;

    //Actualizar posicion de la camara
    renderer.camara.updatePosition(mouseVector[0], mouseVector[1], 0);
    renderer.camara.Update(delta);

    update(delta);
    renderer.draw();
    lastRender = timestamp;

    //Suavizar movimiento del mouse
    mouseVector[0] = renderer.camara.lerp(mouseVector[0], 0, delta * 20);
    mouseVector[1] = renderer.camara.lerp(mouseVector[1], 0, delta * 20);

    window.requestAnimationFrame(loop);
}
var lastRender = 0;
var counter = 0;
window.requestAnimationFrame(loop)