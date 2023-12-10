var CG =  CG || {};
/**
 * Clase Material
 */
CG.Material_Textura = class extends CG.Material
{
    constructor(gl,albedo, normal, specular)
    {
        super(gl, "2d-fragment-shader");

        albedo = (albedo || "uvgrid.png");
        normal = (normal || "uvgrid.png");
        specular = (specular || "uvgrid.png");
        
        this.texturaAlbedo = CG.Shader.createTexture(gl, albedo);
        this.texturaNormal = CG.Shader.createTexture(gl, normal);
        this.texturaSpecular = CG.Shader.createTexture(gl, specular);
        
    }

    setDrawParams(gl, camara)
    {
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texturaAlbedo);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texturaNormal);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.texturaSpecular);
    }
}