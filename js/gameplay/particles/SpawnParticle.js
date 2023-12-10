var CG =  CG || {};

CG.SpawnParticle = class extends CG.Particle
{
    constructor(name, size, time, posicion, rotacion, scene)
    {
        super(time, new CG.Plane(
            scene.gl, 
            [1, 1, 1, 1], 
            5, 5, 
            CG.Matrix4.translate(posicion)
            ),new CG.Vector3(0,0,0), rotacion, 
            scene, name);
        this.size = size;
        this.animationScale = 0;
    }

    animate(delta)
    {
        this.animationScale = Math.sin(this.lifePercentage * Math.PI);
        this.scale.x = this.animationScale * this.size;
        this.scale.y = this.animationScale * this.size;
        this.scale.z = this.animationScale * this.size;

        this.rotacion.z = this.lifePercentage * this.lifePercentage * Math.PI * 0.25;
    }
}