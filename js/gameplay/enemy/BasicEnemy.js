var CG =  CG || {};
//Enemigo basico
/**
 * Se mueve en un patron de cuadricula. Al llegar a un limite, avanza hacia adelante
 */
CG.BasicEnemy = class extends CG.GameObject
{
    /**
     * 
     * @param {Number} squares : Dimension X de la casilla
     * @param {Number} current : Casilla actual del enemigo
     * @param {Number} dir : Direccion
     * @param {Number} lowerlimit : Casilla limite inferior para moverse hacia adelante
     * @param {Number} higherlimit : Casilla limite superior para moverse hacia adelante
     * @param {Vector3} posicion : Posicion inicial
     * @param {Vector3} rotacion : Rotacion incial
     * @param {*} renderer 
     */
    constructor(squares, current, dir, lowerlimit, higherlimit, posicion, rotacion, renderer)
    {
       super("enemy",posicion, rotacion, new CG.Cono(
        renderer.gl, 
        [0, 1, 0, 1], 
        2, 2, 16, 16, 
        CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
        ),
        renderer);

        //Cuadricula
        this.xhigherlimit = 40;
        this.xlowerlimit = -40;
        this.xlenght = 80;
        this.squares = (squares || 8);
        if(this.squares < 1)
        {
            this.squares = 1;
        }
        //Tamaño de casilla
        this.xjump = this.xlenght / this.squares;
        //Obtener destino inicial
        this.startingpos = this.xlowerlimit + this.xjump / 2;
        this.destino = new CG.Vector3(this.startingpos, posicion.y, posicion.z);
        this.currentSquare = (current || 1);
        if(this.currentSquare < 0)
        {
            this.currentSquare = 0;
        }

        this.lowerS = lowerlimit;
        this.higerS = higherlimit;

        this.dir = dir;
        this.pauseCounter = 0;
        this.pauseTime = 1;

        this.moverY = false;
    }

    update(delta)
    {
        this.posicion.x = CG.Math.lerp(this.posicion.x, this.destino.x, delta * 5);
        this.posicion.z = CG.Math.lerp(this.posicion.z, this.destino.z, delta * 5);
        //Si el enemigo llego al destino
        if(CG.Vector3.distance(this.posicion, this.destino) < 1)
        {
            this.pauseCounter += delta;
            //Mover a la siguiente casilla X si no hay movimiento z en espera
            if(!this.moverY)
            {
                //Si se llego al borde, mover en z
                if(this.currentSquare > this.higerS || this.currentSquare < this.lowerS)
                {
                    this.moverY = true;
                    this.destino.z += 10;
                }
                //De otro modo, poner la siguiente casilla como destino
                if(this.pauseCounter > this.pauseTime)
                {
                    this.pauseCounter = 0;
                    this.currentSquare += 1 * this.dir;
                    this.destino.x = this.startingpos + this.xjump * this.currentSquare;
                }
            }
            else
            {
                this.pauseCounter += delta;
                //Mover en X si ya se cambio de posicion y
                if(this.pauseCounter > this.pauseTime)
                {
                    this.moverY = false;
                    this.dir *= -1;
                    this.pauseCounter = 0;
                    this.currentSquare += 1 * this.dir;
                    this.destino.x = this.startingpos + this.xjump * this.currentSquare;
                }
            }
        }

        if(this.posicion.z  > 20)
        {
            this.destroy();
        }
    }
}