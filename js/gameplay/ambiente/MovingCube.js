var CG =  CG || {};

CG.MovingCube = class extends CG.GameObject
{
    constructor(posicion, rotacion, scene)
    {
        super("ambiente", posicion, rotacion,new CG.PrismaRectangular(
            scene.renderer.gl, 
            [1, 0.2, 0.3, 1], 
            3, 3, 3, 
            CG.Matrix4.translate(0,0,0),
            ),
            scene);

        this.velocidad = 50;
    }

    update(delta)
    {
        this.posicion.z += this.velocidad * delta;
        if(this.posicion.z > 20)
        {
            this.posicion.z = -200;
        }
    }
}