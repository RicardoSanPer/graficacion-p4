var CG =  CG || {};

CG.LuzDireccional = class{

    constructor()
    {
        this.angleX = 180;
        this.angleY = 45;
        this.distance = 11;

        this.position = new CG.Vector4(0, 0, this.distance,0);

        this.updatePosition();
    }

    //Actualizar posicion de la camara
    Update(delta)
    {

        this.angleX = (this.angleX > 360) ? this.angleX - 360 : (this.angleX < 0)? this.angleX + 360 : this.angleX;
        this.angleY = (this.angleY > 90) ? 90 : (this.angleY < -90)? -90 : this.angleY;
        this.distance = (this.distance < 0)? 0 : this.distance;

        var angle = Math.PI / 180;
        this.distance = (this.distance < 0)? 0 : this.distance;
        let x = Math.cos(this.angleY * angle) * Math.cos(this.angleX * angle) * this.distance;
        let y = Math.sin(this.angleY * angle) * this.distance;
        let z = Math.cos(this.angleY * angle) * Math.sin(this.angleX * angle) * this.distance;
        let displacement = new CG.Vector4(x,y,z,0);
        this.position = displacement;
        
    }

    updatePosition(x,y)
    {
        x = (x || this.angleX);
        y = (y || this.angleY);
        this.angleX = x;
        this.angleY = y;
    }

    lerp(a,b,delta)
    {
        return a + (delta * (b - a));
    }
}