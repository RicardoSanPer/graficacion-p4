var CG =  CG || {};

CG.Projectile = class extends CG.GameObject{
    constructor(posicion, rotacion, renderer)
    {
        super("player_projectile",posicion,rotacion,
                new CG.Esfera(
                    renderer.gl, 
                    [0, 1, 1, 1], 
                    1, 8, 8, 
                    CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
                    ),
            renderer);

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
}