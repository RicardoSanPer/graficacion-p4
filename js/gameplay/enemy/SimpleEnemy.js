var CG =  CG || {};
/**Enemigo que se mueve solo hacia adelante*/
CG.SimpleEnemy = class extends CG.EnemyEmpty
{
    constructor(moveDistance, movementSpeed, pauseTime, posicion, rotacion, scene)
    {
        super(posicion, rotacion,
            new CG.CustomMesh(
                scene.gl,
                CG.Matrix4.translate(new CG.Vector3(0, 0, 0))
                , "enemigo1.obj"),
            scene, new CG.Material_Textura(scene.gl, "enemigo.png"));
        this.pauseTime = pauseTime;
        this.moveDistance = moveDistance;
        this.movementSpeed = movementSpeed;
        this.posicionDestino = new CG.Vector3(this.posicion.x, -20, this.posicion.z);
        this.counter = 0;
    }

    update(delta)
    {
        this.counter += delta;
        if(this.destroyed)
        {
            this.destroySequence(delta);
            return;
        }
        this.posicion.z = CG.Math.lerp(this.posicion.z, this.posicionDestino.z, delta * this.movementSpeed);

        //Cambiar destino al arribar
        if(Math.abs(this.posicionDestino.z - this.posicion.z)  < 1.0)
        {
            if(this.counter > this.pauseTime)
            {
                this.counter = 0;
                this.posicionDestino.z += this.moveDistance;

                document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
                    {objeto : "EnemyProjectile",
                        pos : this.posicion,
                        rot : new CG.Vector3(0,0,0),
                        name : "enemy_projectile",
                    },
                }));
            }
        }
        if(this.posicion.z > 20)
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