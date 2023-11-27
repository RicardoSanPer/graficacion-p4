var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.renderer = new CG.Renderer();
        this.gameobjects = {};
        this.player = new CG.Player(new CG.Vector3(0,-20,0), new CG.Vector3(-45,0,0), this);

        this.destroy = this.destroy.bind(this);
        this.spawn = this.spawn.bind(this);

        for(let i = 0; i < 4; i++)
        {
            let z1 = Math.floor(Math.random() * 200);
            let z2 = Math.floor(Math.random() * 200);
            let z3 = Math.floor(Math.random() * 200);
            let z4 = Math.floor(Math.random() * 200);
            let c = new CG.MovingCube(new CG.Vector3(-25,-35,-z1), new CG.Vector3(0,0,0),this);
            let c2 = new CG.MovingCube(new CG.Vector3(25,-35,-z2), new CG.Vector3(0,0,0),this);
            let c3 = new CG.MovingCube(new CG.Vector3(25,35,-z3), new CG.Vector3(0,0,0),this);
            let c4 = new CG.MovingCube(new CG.Vector3(-25,35,-z4), new CG.Vector3(0,0,0),this);
        }
        
        this.counter = 0;
        this.enemyCount = 5;
        this.enemyProgress = 0;
        this.time = 2;
        

        document.addEventListener("elementDeleted", this.destroy);
        document.addEventListener("elementSpawn", this.spawn);
    }

    update(delta)
    {
        this.handleCollisions();
        this.counter += delta;
        if(this.counter > this.time)
        {
            this.counter = 0;
            this.enemyProgress += 1;
            if(this.enemyProgress == this.enemyCount)
            {
                this.enemyProgress = 0;
                let jump1 = new CG.JumpingEnemy(20, 25, 3, 3, new CG.Vector3(0, -20, -200), new CG.Vector3(0,0,0), this);
                let jump2 = new CG.JumpingEnemy(20, 25, 3, 3, new CG.Vector3(20, -20, -200), new CG.Vector3(0,0,0), this);
                let jump3 = new CG.JumpingEnemy(20, 25, 3, 3, new CG.Vector3(-20, -20, -200), new CG.Vector3(0,0,0), this);
                let s1 = new CG.SpawnParticle("flare.png", 5,1, new CG.Vector3(-20, -20, -195), new CG.Vector3(0,0,0), this);
                let s2 = new CG.SpawnParticle("flare.png", 5,1, new CG.Vector3(0, -20, -195), new CG.Vector3(0,0,0), this);
                let s3 = new CG.SpawnParticle("flare.png", 5,1, new CG.Vector3(20, -20, -195), new CG.Vector3(0,0,0), this);
            }
            else
            {
                this.enemyProgress += 1;
                let en = new CG.EnemyLine(10, 1, 5, false, 10, 0.5, this);
            }
        }
        for (const [key, value] of Object.entries(this.gameobjects))
        {
            value.update(delta);
            value.updateGeometry();
        }
        this.renderer.draw();
    }

    handleCollisions()
    {
        for(const [key, value] of Object.entries(this.gameobjects))
        {
            if(value.tag == "player_projectile")
            {
                for(const [key2, value2] of Object.entries(this.gameobjects))
                {
                    if(value2.tag == "enemy")
                    {
                        this.checkCollision(value, value2);
                    }
                }
            }
        }
    }

    checkCollision(entity1, entity2)
    {
        if(CG.Vector3.distance(entity1.posicion, entity2.posicion) < 2)
        {
            entity1.hit();
            entity2.hit();
        }
    }

    //Pada input al jugador
    passInput(input)
    {
        this.player.passInput(input);
    }

    //Destruye un elemento quitandolo de la lista de objetos por actualizar y de la cola de renderizado
    destroy(e)
    {
        var eventData = e.detail;
        
        this.renderer.destroy(eventData.id);
        delete this.gameobjects[eventData.id];
    }
    //Crea un objeto tipo gameobject
    spawn(e)
    {
        var eventData = e.detail;
        if(eventData.objeto == "Projectile")
        {
            var objeto = new CG.Projectile(eventData.pos.clone(), eventData.rot.clone(), this);
        }
        else if(eventData.objeto == "SpawnParticle")
        {
            var objeto = new CG.SpawnParticle(eventData.name, eventData.scale, eventData.duration, eventData.pos.clone(), eventData.rot.clone(), this);
        }  
    }
}