var CG =  CG || {};

/**
 * Objeto de muesta para comprobar funcionamiento de materiales
 */
CG.Sample = class {

    constructor(gl)
    {
        this.mesh = new CG.Esfera(
            gl, 
            [0, 1, 1, 1], 
            1, 4, 4, 
            CG.Matrix4.scale(new CG.Vector3(10, 10, 10)),
            );

        this.material = new CG.Material(gl, "sample-shader", "2d-vertex-shader");
    }

    draw(gl, pvm)
    {
        this.material.draw(gl, pvm, this.mesh);
    }
}