var CG =  CG || {};

CG.MovingCube = class extends CG.GameObject
{
    constructor(posicion, rotacion, scene)
    {
        super("ambiente", posicion, rotacion,new CG.CustomMesh
            (scene.gl, CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),"space_rail.obj"),
            scene, new CG.Material_Textura(gl, "space_station.png"));

        this.velocidad = 50;
    }

    update(delta)
    {
        this.posicion.z += this.velocidad * delta;
        if(this.posicion.z > 200)
        {
            this.posicion.z = -700;
        }
    }
}