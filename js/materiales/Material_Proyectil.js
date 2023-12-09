var CG =  CG || {};
/**
 * Clase Material
 */
CG.Material_Proyectil = class extends CG.Material
{
    constructor(gl,color)
    {
        super(gl, "fragment-projectile");

        this.color = color;
        
        
        this.CamPosition = gl.getUniformLocation(this.program, "cameraPos");
    }

    setDrawParams(gl, camara)
    {
        
        gl.uniform3f(this.CamPosition, camara.position.x, camara.position.y, camara.position.z);
    }
}