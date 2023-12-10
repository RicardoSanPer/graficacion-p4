var CG =  CG || {};

CG.EnemyEmpty = class extends CG.GameObject
{
    constructor(posicion, rotacion, mesh, scene, material)
    {
        super("enemy",posicion, rotacion, mesh,
            scene, material);
        this.destroyed = false;
        
        this.velocidad = 0;
    }

    hit()
    {
        if(!this.destroyed)
        {
            this.destroyed = true;
            let audio = new Audio("resources/audio/enemy-defeat.wav");
            audio.volume = 0.25;
            audio.play();
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