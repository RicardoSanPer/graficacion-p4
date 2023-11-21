var CG =  CG || {};

CG.EnemyEmpty = class extends CG.GameObject
{
    constructor(posicion, rotacion, scene)
    {
        super("enemy",posicion, rotacion, new CG.Cono(
            scene.renderer.gl, 
            [0, 1, 0, 1], 
            2, 2, 16, 16, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
            ),
            scene);
    }
}