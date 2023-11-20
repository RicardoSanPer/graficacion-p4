var CG =  CG || {};

CG.Player = class extends CG.GameObject{
    constructor(posicion, rotacion, renderer)
    {
       super(posicion, rotacion, new CG.Cono(
        renderer.gl, 
        [0, 1, 0, 1], 
        2, 2, 16, 16, 
        CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
        ),
        renderer);
       this.dir = 1;
       this.speed = 100;
       this.velocity = new CG.Vector3(0,0,0);
       this.inputVector = [0,0];
        this.fireRate = 0.1;
       this.lastProjectile = 0;
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
        this.posicion.z -= this.velocity.y;

        if(this.posicion.x < -40) {this.posicion.x = -40;}
        if(this.posicion.x > 40) { this.posicion.x = 40;}
        if(this.posicion.z < -20) { this.posicion.z = -20;}
        if(this.posicion.z > 20) { this.posicion.z = 20;}
    }

    spawnProjectile()
    {
        document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
            {objeto : "Projectile",
                pos : this.posicion,
                rot : new CG.Vector3(0,0,0),
            },
        }));
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
            y -= 1
        }

        if(input[" "])
        {
            let time = new Date().getTime();
            if(time - this.lastProjectile > 1000 * this.fireRate)
            {
                this.lastProjectile = time;
                this.spawnProjectile();
            }
        }

        this.inputVector[0] = x;
        this.inputVector[1] = y;
        //CG.Math.normalize(this.inputVector);
    }
}