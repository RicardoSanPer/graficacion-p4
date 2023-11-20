var CG =  CG || {};
//Enemigo basico
/**
 * Se mueve en un patron de cuadricula. Al llegar a un limite, avanza hacia adelante
 */
CG.BasicEnemy = class extends CG.EnemyEmpty
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
    constructor(xsquares, current, dir, lowerlimit, higherlimit, movementSpeed, pauseTime, posicion, rotacion, renderer)
    {
       super(posicion, rotacion, renderer);
        //Movimiento
        this.movementSpeed = (movementSpeed || 1);
        this.pauseTime = (pauseTime || 1);

        //Cuadricula
        this.xmin = -35;
        this.width = 70;
        this.xsquares = xsquares;
        this.squareSize = this.width / this.xsquares;
        this.squareOffset = this.squareSize / 2;
        this.currentSquare = current;
        this.lowerlimit = lowerlimit;
        this.higherlimit = higherlimit;

        this.dir = dir;

        let x = this.xmin + this.squareOffset + (this.currentSquare + 1) * this.squareSize;
        this.destino = new CG.Vector3(x,this.posicion.y,this.posicion.z);

        this.pauseCounter = 0;
    }

    update(delta)
    {
        this.posicion.x = CG.Math.lerp(this.posicion.x, this.destino.x, delta * this.movementSpeed);
        this.posicion.z = CG.Math.lerp(this.posicion.z, this.destino.z, delta * this.movementSpeed);
        //Si el enemigo llego al destino
        
        this.pauseCounter += delta;
        //Mover en X si ya se cambio de posicion y
        if(CG.Vector3.distance(this.destino, this.posicion) < 1)
        {
            if(this.pauseCounter > this.pauseTime)
            {
                
                if(this.currentSquare > this.higherlimit || this.currentSquare < this.lowerlimit)
                {
                    this.dir *= -1;
                }
                this.currentSquare += this.dir;
                this.pauseCounter = 0;
                this.destino.x = this.xmin + this.squareOffset + (this.currentSquare) * this.squareSize;
            }
        }

        if(this.posicion.z  > 25)
        {
            this.destroy();
        }
    }
}