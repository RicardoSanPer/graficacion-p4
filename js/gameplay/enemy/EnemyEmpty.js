var CG =  CG || {};

CG.EnemyEmpty = class extends CG.GameObject
{
    constructor(posicion, rotacion, scene)
    {
        super("enemy",posicion, rotacion, new CG.Cono(
            scene.renderer.gl, 
            [0, 1, 0, 1], 
            2, 2, 6, 2, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
            ),
            scene);
        this.destroyed = false;
        
        this.velocidad = 0;
    }

    hit()
    {
        if(!this.destroyed)
        {
            this.destroyed = true;
        }
    }

    destroySequence(delta)
    {
        this.velocidad = CG.Math.lerp(this.velocidad, 1, delta);
        this.posicion.y -= 1 * this.velocidad;
        this.posicion.z += 1 * this.velocidad;
        this.rotacion.z += 0.1 * this.velocidad;
        this.rotacion.x += 0.1 * this.velocidad;

        if(this.posicion.y < -100)
        {
            document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
                {   
                    objeto : "SpawnParticle",
                    name : "flare.png",
                    scale : 2,
                    duration: 1,
                    pos : this.posicion,
                    rot : new CG.Vector3(0,0,0),
                },
            }));
            this.destroy();
        }
    }
}