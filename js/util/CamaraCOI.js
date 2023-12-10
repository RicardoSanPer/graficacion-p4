var CG =  CG || {};

CG.CamaraCOI = class{

    constructor(canvas, distance, coi)
    {
        this.angleX = 90;
        this.angleY = 45;
        this.distance = (distance || 11);
        this.canvas = canvas;

        this.position = new CG.Vector3(0, 0, this.distance);
        this.coi = (coi || new CG.Vector3(0,0,0));

        this.displacementX = 0;
        this.displacementY = 0;
        this.displacementZ = 0;

        this.perspectivePos = new CG.Vector3(0,10,-120);
        this.perspectiveCOI = new CG.Vector3(0,-120,-100);

        this.perspective = true;
        this.updatePosition();
    }

    //Actualizar posicion de la camara
    Update(delta)
    {
        //Suavizado del movimiento
        this.displacementX = CG.Math.lerp(this.displacementX, 0, delta * 20);
        this.displacementY = CG.Math.lerp(this.displacementY, 0, delta * 20);
        this.displacementZ = CG.Math.lerp(this.displacementZ, 0, delta * 20);

        this.angleX += this.displacementX;
        this.angleY += this.displacementY;
        this.distance += this.displacementZ;
        //Clamp
        this.angleX = (this.angleX > 360) ? this.angleX - 360 : (this.angleX < 0)? this.angleX + 360 : this.angleX;
        this.angleY = (this.angleY > 90) ? 90 : (this.angleY < -90)? -90 : this.angleY;
        this.distance = (this.distance < 0)? 0 : this.distance;

        //Mover
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
        
        if(this.perspective)
        {
            this.viewMatrix = CG.Matrix4.lookAt(this.position, this.coi, new CG.Vector3(0, 1, 0));
            this.projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, this.canvas.width/this.canvas.height, 1, 2000);;
        }
        else{
            this.viewMatrix = CG.Matrix4.lookAt(this.perspectivePos, this.perspectiveCOI , new CG.Vector3(0, 1, 0));
            this.projectionMatrix = CG.Matrix4.orthographic(200, -200, 200, -200, 500, -100);;
        }
        this.viewProjectionMatrix = CG.Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
    }

    //Desplaza la camara
    updatePosition(x,y,z)
    {
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);
        this.displacementX = x;
        this.displacementY = y;
        this.displacementZ += z;
    }
}