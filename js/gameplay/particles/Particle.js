var CG =  CG || {};
/**
 * Particula. Mesh con tiempo de vida
 */
CG.Particle = class extends CG.GameObject
{
    /**
     * 
     * @param {Number} duracion Duracion de vida
     * @param {*} mesh 
     * @param {*} posicion 
     * @param {*} rotacion 
     * @param {*} renderer 
     */
    constructor(duracion, mesh, posicion, rotacion, scene, name)
    {
        super("particula", posicion, rotacion, mesh, scene,
            new CG.Material_Particula(scene.gl, name));
        this.duracion = duracion;
        this.counter = 0;
        this.lifePercentage = 0;
    }

    update(delta)
    {
        this.counter += delta;
        this.lifePercentage = this.counter / this.duracion;
        this.animate(delta);
        if(this.counter > this.duracion)
        {
            this.destroy();
        }
    }
    
    animate(delta)
    {

    }
}