var CG =  CG || {};

CG.Projectile = class extends CG.GameObject{
    constructor(posicion, rotacion, scene)
    {
        super("player_projectile",posicion,rotacion,
                new CG.Esfera(
                    scene.renderer.gl, 
                    [0, 1, 1, 1], 
                    1, 4, 4, 
                    CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
                    ),
            scene);

        this.counter = 0;
    }

    update(delta)
    {
        this.posicion.z -= 120*delta;
        this.counter += delta;
        if(this.posicion.z < -400)
        {
            this.destroy();
        }
    }

    hit()
    {
        document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
            {objeto : "SpawnParticle",
                name : "explosion.png",
                scale : 1,
                duration : 0.2,
                pos : new CG.Vector3(this.posicion.x, this.posicion.y, this.posicion.z+5),
                rot : new CG.Vector3(0,0,0),
            },
        }));
        this.destroy();
    }
}