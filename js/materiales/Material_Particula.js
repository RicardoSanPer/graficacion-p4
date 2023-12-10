var CG =  CG || {};
/**
 * Clase Material
 */
CG.Material_Particula = class extends CG.Material
{
    constructor(gl,albedo)
    {
        super(gl, "particle");

        albedo = (albedo || "uvgrid.png");
        
        this.texturaAlbedo = CG.Shader.createTexture(gl, albedo);
        
    }

    setDrawParams(gl, camara)
    {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texturaAlbedo);
    }
}