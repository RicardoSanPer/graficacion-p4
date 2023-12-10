var CG =  CG || {};
/**Projectil. Se mueve en linea recta */
CG.Projectile = class extends CG.GameObject{
    constructor(posicion, rotacion, scene, name, invert, color)
    {
        super(name,posicion,rotacion,
                new CG.Esfera(
                    scene.gl, 
                    [0, 1, 1, 1], 
                    1, 4, 4, 
                    CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
                    ),
            scene, new CG.Material(scene.gl, "fragment-projectile", color));
        
        this.dir = invert;
        this.counter = 0;
    }

    update(delta)
    {
        this.posicion.z -= 120*delta*this.dir;
        this.counter += delta;
        if(this.posicion.z < -400 || this.posicion.z > 50)
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