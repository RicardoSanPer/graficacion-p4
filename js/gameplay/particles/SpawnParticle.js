var CG =  CG || {};

CG.SpawnParticle = class extends CG.Particle
{
    constructor(time, posicion, rotacion, scene)
    {
        super(time, new CG.Dodecaedro(
            scene.renderer.gl, 
            [0, 0, 1, 1], 
            2, 
            CG.Matrix4.translate(posicion),
            ),new CG.Vector3(0,0,0), rotacion,
            scene);

        this.animationScale = 0;
    }

    animate(delta)
    {
        this.animationScale = Math.sin(this.lifePercentage * Math.PI);
        this.scale.x = this.animationScale * 3;
        this.scale.y = this.animationScale * 3;
        this.scale.z = this.animationScale * 3;

        this.rotacion.z = this.lifePercentage * Math.PI * 2;
    }
}