var CG =  CG || {};

CG.Camara = class{

    constructor(canvas)
    {
        this.angleX = 90;
        this.angleY = 45;
        this.distance = 11;
        this.canvas = canvas;

        this.position = new CG.Vector3(0, 0, this.distance);
        this.coi = new CG.Vector3(0,0,0);
        this.updateCamera();
    }

    //Actualizar posicion de la camara
    updateCamera()
    {
        var angle = Math.PI / 180;
        let x = Math.cos(this.angleY * angle) * Math.cos(this.angleX * angle) * this.distance;
        let y = Math.sin(this.angleY * angle) * this.distance;
        let z = Math.cos(this.angleY * angle) * Math.sin(this.angleX * angle) * this.distance;
        let displacement = new CG.Vector3(x,y,z);
        this.position = displacement;
        
        this.updateMatrix();
    }

    //Actualizar matrices de proyeccion
    updateMatrix()
    {
        let coi = new CG.Vector3(0, 0, 0);
        
        this.viewMatrix = CG.Matrix4.lookAt(this.position, this.coi, new CG.Vector3(0, 1, 0));
        this.projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, this.canvas.width/this.canvas.height, 1, 2000);;
        this.viewProjectionMatrix = CG.Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
    }
}