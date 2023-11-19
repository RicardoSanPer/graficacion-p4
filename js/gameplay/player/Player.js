var CG =  CG || {};

CG.Player = class extends CG.GameObject{
    constructor(posicion, rotacion, renderer)
    {
       super(posicion, rotacion, renderer);
       this.dir = 1;
       this.speed = 100;
       this.velocity = new CG.Vector3(0,0,0);
       this.inputVector = [0,0];
    }

    update(delta)
    {
        this.velocity.x = CG.Math.lerp(this.velocity.x, this.inputVector[0], delta * 10)  * this.speed * delta;
        this.velocity.y = CG.Math.lerp(this.velocity.y, this.inputVector[1], delta * 10)  * this.speed * delta;
        this.move();

    }
    move()
    {
        this.posicion.x += this.velocity.x;
        this.posicion.y += this.velocity.y;

        if(this.posicion.x < -50) { this.posicion.x = -50;}
        if(this.posicion.x > 50) { this.posicion.x = 50;}
        if(this.posicion.y < -20) { this.posicion.y = -20;}
        if(this.posicion.y > 20) { this.posicion.y = 20;}
    }

    passInput(input)
    {
        let x = 0;
        let y = 0;
        if(input["a"])
        {
            x -= 1;
        }
        if(input["d"])
        {
            x += 1
        }
        if(input["w"])
        {
            y += 1;
        }
        if(input["s"])
        {
            y -= 1;
        }
        this.inputVector[0] = x;
        this.inputVector[1] = y;
        //CG.Math.normalize(this.inputVector);
    }
}