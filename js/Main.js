let canvas = document.getElementById("the_canvas");
let scene = new CG.Scene();
let isCanvasFocus = false;
let mousePreviousPos = [0,0];
let mouseVector = [0,0];
const overlay = document.getElementById('overlay');
let map = {}
//Input
onkeydown = onkeyup = function(e){
  e = e || event; // to deal with IE
  map[e.key] = e.type == 'keydown';
  /* insert conditional here */
  scene.passInput(map)
}


//Bucle de dibujado
function loop(timestamp)
{  
    let delta = (timestamp - lastRender)/ 1000;
    counter += delta;

    //Actualizar posicion de la camara
    scene.update(delta);
    lastRender = timestamp;

    //Suavizar movimiento del mouse

    window.requestAnimationFrame(loop);
}
var lastRender = 0;
var counter = 0;
window.requestAnimationFrame(loop)