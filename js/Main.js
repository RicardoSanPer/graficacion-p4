
let renderer = new CG.Renderer();
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
    renderer.camara.updatePosition(angleX, angleY, distance);
  });

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
    renderer.camara.Update(delta);
    update(delta);
    renderer.draw();
    lastRender = timestamp;

    window.requestAnimationFrame(loop);
}
var lastRender = 0;
var counter = 0;
window.requestAnimationFrame(loop)