var CG =  CG || {};

CG.CamaraCOI = class{

    constructor(canvas, coi)
    {
        this.angleX = 90;
        this.angleY = 45;
        this.distance = 11;
        this.canvas = canvas;

        this.position = new CG.Vector3(0, 0, this.distance);
        this.coi = (coi || new CG.Vector3(0,0,0));

        this.displacementX = 0;
        this.displacementY = 0;

        this.updatePosition();
    }

    //Actualizar posicion de la camara
    Update(delta)
    {
        this.displacementX = this.lerp(this.displacementX, 0, delta * 20);
        this.displacementY = this.lerp(this.displacementY, 0, delta * 20);

        this.angleX += this.displacementX;
        this.angleY += this.displacementY;

        this.angleX = (this.angleX > 360) ? this.angleX - 360 : (this.angleX < 0)? this.angleX + 360 : this.angleX;
        this.angleY = (this.angleY > 90) ? 90 : (this.angleY < -90)? -90 : this.angleY;
        this.distance = (this.distance < 0)? 0 : this.distance;

        var angle = Math.PI / 180;
        this.distance = (this.distance < 0)? 0 : this.distance;
        let x = Math.cos(this.angleY * angle) * Math.cos(this.angleX * angle) * this.distance;
        let y = Math.sin(this.angleY * angle) * this.distance;
        let z = Math.cos(this.angleY * angle) * Math.sin(this.angleX * angle) * this.distance;
        let displacement = new CG.Vector3(x,y,z);
        this.position = displacement;
        
    }

    //Actualizar matrices de proyeccion
    updateMatrix()
    {      
        this.viewMatrix = CG.Matrix4.lookAt(this.position, this.coi, new CG.Vector3(0, 1, 0));
        this.projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, this.canvas.width/this.canvas.height, 1, 2000);;
        this.viewProjectionMatrix = CG.Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
    }

    updatePosition(x,y,z)
    {
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);
        this.displacementX = x;
        this.displacementY = y;
        this.distance += z;
    }

    lerp(a,b,delta)
    {
        return a + (delta * (b - a));
    }
}