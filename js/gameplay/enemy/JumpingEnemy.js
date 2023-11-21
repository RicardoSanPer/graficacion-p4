var CG =  CG || {};
/**Enemigo que brinca */
CG.JumpingEnemy = class extends CG.EnemyEmpty
{
    constructor(jumpHeight, jumpDistance, movementSpeed, pauseTime, posicion, rotacion, scene)
    {
        super(posicion, rotacion,scene);
        this.jumpDistance = jumpDistance;
        this.jumpHeight = jumpHeight;
        this.pauseTime = pauseTime;
        this.movementSpeed = movementSpeed;
        this.posicionDestino = new CG.Vector3(this.posicion.x, -20, this.posicion.z);
        this.counter = 0;
    }

    update(delta)
    {
        this.counter += delta;
        this.posicion.z = CG.Math.lerp(this.posicion.z, this.posicionDestino.z, delta * this.movementSpeed);

        //Brincar
        if(this.counter <= this.pauseTime)
        {
            let percentage = Math.abs(this.posicionDestino.z - this.posicion.z) / this.jumpDistance;
            let angle = percentage * Math.PI;
            this.posicion.y = this.posicionDestino.y + Math.sin(angle) * this.jumpHeight;
            this.rotacion.x = Math.PI* 2 - (angle * 2);
        }
        //Cambiar destino al arribar
        if(Math.abs(this.posicionDestino.z - this.posicion.z)  < 1.0)
        {
            if(this.counter > this.pauseTime)
            {
                this.counter = 0;
                this.posicionDestino.z += this.jumpDistance;
            }
        }
        if(this.posicion.z > 20)
        {
            this.destroy();
        }
    }
}