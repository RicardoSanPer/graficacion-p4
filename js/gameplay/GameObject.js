var CG =  CG || {};

CG.GameObject = class{
    constructor(posicion, rotacion, renderer)
    {
        this.posicion = new CG.Vector3(0,0,0);
        this.posicion.x = (posicion[0] || 0);
        this.posicion.y = (posicion[1] || 0);
        this.posicion.z = (posicion[2] || 0);

        this.rotacion = new CG.Vector3(0,0,0);
        this.rotacion.x = (rotacion[0] || 0);
        this.rotacion.y = (rotacion[1] || 0);
        this.rotacion.z = (rotacion[2] || 0);

        this.mesh = new CG.Cono(
            renderer.gl, 
            [0, 1, 0, 1], 
            2, 2, 16, 16, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
            );
        renderer.geometry.push(this.mesh);
    }

    updateGeometry()
    {
        this.mesh.setRotation(this.rotacion.x, this.rotacion.y, this.rotacion.z);
        this.mesh.setTranslation(this.posicion.x, this.posicion.y, this.posicion.z);
    }

    update(delta)
    {

    }
}