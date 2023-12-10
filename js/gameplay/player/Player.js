var CG =  CG || {};
/**Objeto del jugador */
CG.Player = class extends CG.GameObject{
    constructor(posicion, rotacion, scene)
    {
       super("player",posicion, rotacion, new CG.CustomMesh(
        scene.gl,
        CG.Matrix4.translate(new CG.Vector3(0, 0, 0))
        , "nave_jugador.obj"),
        scene,
        new CG.Material_Textura(scene.gl, "player.png"));
       this.dir = 1;
       this.speed = 100;
       this.velocity = new CG.Vector3(0,0,0);
       this.inputVector = [0,0];
        this.fireRate = 0.3;
       this.lastProjectile = 0;

       this.shotsound = new Audio("/resources/audio/gun-shot.wav");

       this.vidas = 3;
    }

    update(delta)
    {
        this.velocity.x = CG.Math.lerp(this.velocity.x, this.inputVector[0], delta * 10)  * this.speed * delta;
        this.velocity.y = CG.Math.lerp(this.velocity.y, this.inputVector[1], delta * 10)  * this.speed * delta;
        
        this.move();

    }
    /**Mover */
    move()
    {
        this.posicion.x += this.velocity.x;
        this.posicion.z -= this.velocity.y;

        if(this.posicion.x < -40) {this.posicion.x = -40;}
        if(this.posicion.x > 40) { this.posicion.x = 40;}
        if(this.posicion.z < -20) { this.posicion.z = -20;}
        if(this.posicion.z > 20) { this.posicion.z = 20;}
    }
    /**Disparar */
    spawnProjectile()
    {
        document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
            {objeto : "Projectile",
                pos : this.posicion,
                rot : new CG.Vector3(0,0,0),
                name : "player_projectile",
            },
        }));
    }

    /**Input */
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

        if(input[" "] && !this.destroyed)
        {
            let time = new Date().getTime();
            if(time - this.lastProjectile > 1000 * this.fireRate)
            {
                this.lastProjectile = time;
                this.spawnProjectile();
                
                let sound = this.shotsound.cloneNode();
                sound.volume = 0.25;
                sound.play();
            }
        }

        this.inputVector[0] = x;
        this.inputVector[1] = y;
        //CG.Math.normalize(this.inputVector);
    }

    hit()
    {
        this.vidas -= 1;
        if(this.vidas < 0)
        {
            this.vidas = 0;
        }
        let audio = new Audio("resources/audio/enemy-defeat.wav");
            audio.volume = 0.25;
            audio.play();
            document.dispatchEvent(new CustomEvent("updateVidas",{detail: 
                {   
                    cantidad: this.vidas,
                },
            }));
        if(this.vidas <= 0 && !this.destroyed)
        {
            this.destroyed = true;
            document.dispatchEvent(new CustomEvent("gameover"),{});
        }
    }
}