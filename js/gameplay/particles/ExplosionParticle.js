
var CG =  CG || {};

CG.ExplosionParticle = class extends CG.Particle
{
    constructor(time, posicion, rotacion, scene)
    {
        super(time, new CG.Plane(
            scene.renderer.gl, 
            [1, 1, 1, 1], 
            5, 5, 
            CG.Matrix4.translate(posicion),"explosion.png",
            ),new CG.Vector3(0,0,0), rotacion, 
            scene);

        this.animationScale = 0;
    }

    animate(delta)
    {
        this.animationScale = Math.sin(this.lifePercentage * Math.PI);
        this.scale.x = this.animationScale * 1;
        this.scale.y = this.animationScale * 1;
        this.scale.z = this.animationScale * 1;

        this.rotacion.z = this.lifePercentage * this.lifePercentage * Math.PI * 0.25;
    }
}