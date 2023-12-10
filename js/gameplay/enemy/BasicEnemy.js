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
    constructor(xsquares, current, dir, lowerlimit, higherlimit, movementSpeed, pauseTime, posicion, rotacion, scene)
    {
       super(posicion, rotacion, new CG.CustomMesh(
        scene.gl,
        CG.Matrix4.translate(new CG.Vector3(0, 0, 0))
        , "enemigo1.obj"), scene,
        new CG.Material_Textura(scene.gl, "enemigo.png"));
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
        if(dir < 0)
        {
            this.currentSquare = higherlimit - current;
        }
        this.lowerlimit = lowerlimit;
        this.higherlimit = higherlimit;

        this.dir = dir;

        let x = this.xmin + this.squareOffset + (this.currentSquare + 1) * this.squareSize;
        this.destino = new CG.Vector3(x,this.posicion.y,this.posicion.z);

        this.pauseCounter = 0;
        this.moveToFront = false;
    }

    update(delta)
    {
        this.pauseCounter += delta;
        if(this.destroyed)
        {
            this.destroySequence(delta);
            return;
        }
        this.posicion.x = CG.Math.lerp(this.posicion.x, this.destino.x, delta * this.movementSpeed);
        this.posicion.z = CG.Math.lerp(this.posicion.z, this.destino.z, delta * this.movementSpeed);
        //Si el enemigo llego al destino
        
        //Mover en X si ya se cambio de posicion y
        if(CG.Vector3.distance(this.destino, this.posicion) < 1)
        {
            if(this.pauseCounter > this.pauseTime)
            {
                this.pauseCounter = 0;
                if(this.currentSquare > this.higherlimit || this.currentSquare < this.lowerlimit)
                {
                    this.dir *= -1;
                    this.currentSquare += this.dir;
                    this.moveToFront = true;
                    this.destino.z = this.posicion.z + 20;
                    this.moveToFront = true;
                    document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
                        {objeto : "EnemyProjectile",
                            pos : this.posicion,
                            rot : new CG.Vector3(0,0,0),
                            name : "enemy_projectile",
                        },
                    }));
                }
                else
                {
                    this.destino.x = this.xmin + this.squareOffset + (this.currentSquare) * this.squareSize;
                    this.currentSquare += this.dir;
                }
                
            }
        }

        if(this.posicion.z  > 25)
        {
            //Si el enemigo escapa, quitar puntos
            document.dispatchEvent(new CustomEvent("awardPoints",{detail: 
                {   
                    cantidad: -15,
                },
            }));
            this.destroy();
        }
    }
}