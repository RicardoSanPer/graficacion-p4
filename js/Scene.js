var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.canvas = document.getElementById("the_canvas");
        this.gl = this.canvas.getContext("webgl");

        this.scoreboard = document.getElementById("score");
        this.vidasboard = document.getElementById("vidas");

        if(!this.gl)
        {
            throw "WebGL no soportado";
        }

        this.gameobjects = {};

        this.destroy = this.destroy.bind(this);
        this.spawn = this.spawn.bind(this);

        document.addEventListener("elementDeleted", (e) => this.destroy(e));
        document.addEventListener("elementSpawn", (e) => this.spawn(e));
        document.addEventListener("gameover", (e) => this.gameover(e));
        document.addEventListener("awardPoints", (e) => this.award(e));
        document.addEventListener("updateVidas", (e) => this.vidas(e));

        this.bgmusic = new Audio("/resources/audio/bg.mp3");
        this.bgmusic.loop = true;
        this.bgmusic.play();
        
        this.counter = 0;
        this.enemyCount = 5;
        this.enemyProgress = 0;
        this.time = 2;
        
        this.camara = new CG.CamaraCOI(this.canvas,50, new CG.Vector3(0,0,0));
        this.lightDir = new CG.LuzDireccional(0, 45);
        this.player = new CG.Player(new CG.Vector3(0,-20,0), new CG.Vector3(-45,0,0), this);
        
        this.skybox = new CG.Skybox(this.gl, CG.Matrix4.scale(new CG.Vector3(500, 500, 500) ), "bg2.png");
        this.ambiente1 = new CG.MovingCube(new CG.Vector3(0,0,-300), new CG.Vector3(0,0,0), this);
        this.ambiente1 = new CG.MovingCube(new CG.Vector3(0,0,-700), new CG.Vector3(0,0,0), this);

        this.eventsDone = [false, false, false, false, false, false, false, false];

        this.speed = 1;
        
        this.over = false;
        this.puntaje = 0.0;
    }

    update(delta)
    {
        //REnder
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(1,1,1, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.handleCollisions();
        this.counter += delta;

        this.camara.updateMatrix();
        this.lightDir.Update(delta);
        let lightpos = this.camara.viewMatrix.multiplyVector(this.lightDir.position);

        if(!this.over){
            this.timeline();
        }

        for (const [key, value] of Object.entries(this.gameobjects))
        {
            value.update(delta);
            value.updateGeometry();
            value.draw(this.gl, this.camara, lightpos);
        }

        this.skybox.draw(this.gl, this.camara.viewProjectionMatrix);


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
            else if(value.tag == "enemy_projectile")
            {
                for(const [key2, value2] of Object.entries(this.gameobjects))
                {
                    if(value2.tag == "player")
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
        
        //this.renderer.destroy(eventData.id);
        delete this.gameobjects[eventData.id];
    }
    //Crea un objeto tipo gameobject
    spawn(e)
    {
        var eventData = e.detail;
        if(eventData.objeto == "Projectile")
        {
            var objeto = new CG.Projectile(eventData.pos.clone(), eventData.rot.clone(), this, eventData.name, 1, [138/255,183/255,1,1]);
        }
        if(eventData.objeto == "EnemyProjectile")
        {
            var objeto = new CG.Projectile(eventData.pos.clone(), eventData.rot.clone(), this, eventData.name, -0.5, [1,0,0,1]);
        }
        else if(eventData.objeto == "SpawnParticle")
        {
            var objeto = new CG.SpawnParticle(eventData.name, eventData.scale, eventData.duration, eventData.pos.clone(), eventData.rot.clone(), this);
        }  
    }

    award(e)
    {
        var eventData = e.detail;
        this.puntaje += eventData.cantidad;
        this.scoreboard.textContent = "Puntaje: " + this.puntaje.toString();
    }
    vidas(e)
    {
        var eventData = e.detail;
        this.vidasboard.textContent = "Vidas: " + eventData.cantidad.toString();
    }
    //Juego terminado
    gameover(e)
    {
        this.over = true;

        for (let key in this.gameobjects) {
            if (this.gameobjects.hasOwnProperty(key)) {
            if(this.gameobjects[key].tag != "ambiente")
            {
                delete this.gameobjects[key];
            }
            }
          }
        this.player.destroy();
    }

    timeline()
    {
        if(this.counter*this.speed > 5 && !this.eventsDone[0])
        {
            this.eventsDone[0] = true;
            let jump1 = new CG.SimpleEnemy(20, 3, 3, new CG.Vector3(0, -20, -200), new CG.Vector3(0,0,0), this);
            let jump2 = new CG.SimpleEnemy(20, 3, 3, new CG.Vector3(20, -20, -200), new CG.Vector3(0,0,0), this);
            let jump3 = new CG.SimpleEnemy(20, 3, 3, new CG.Vector3(-20, -20, -200), new CG.Vector3(0,0,0), this);
        }

        if(this.counter*this.speed > 15 && !this.eventsDone[1])
        {
            this.eventsDone[1] = true;
            let jump1 = new CG.SimpleEnemy(20, 3, 3, new CG.Vector3(0, -20, -200), new CG.Vector3(0,0,0), this);
            let jump2 = new CG.SimpleEnemy(20, 3, 3, new CG.Vector3(20, -20, -200), new CG.Vector3(0,0,0), this);
            let jump3 = new CG.SimpleEnemy(20, 3, 3, new CG.Vector3(-20, -20, -200), new CG.Vector3(0,0,0), this);
        }

        if(this.counter*this.speed > 30 && !this.eventsDone[3])
        {
            this.eventsDone[3] = true;
            let jump2 = new CG.JumpingEnemy(5, 20, 3, 3, new CG.Vector3(0, -20, -200), new CG.Vector3(0,0,0), this);
        }

        if(this.counter*this.speed > 35 && !this.eventsDone[4])
        {
            this.eventsDone[4] = true;
            let jump1 = new CG.JumpingEnemy(5, 20, 3, 3, new CG.Vector3(-10, -20, -200), new CG.Vector3(0,0,0), this);
            let jump2 = new CG.JumpingEnemy(5, 20, 3, 3, new CG.Vector3(10, -20, -200), new CG.Vector3(0,0,0), this);
        }

        if(this.counter*this.speed> 40 && !this.eventsDone[5])
        {
            this.eventsDone[5] = true;
            let jump1 = new CG.JumpingEnemy(5, 20, 3, 3, new CG.Vector3(0, 0, -200), new CG.Vector3(0,0,0), this);
            let jump2 = new CG.JumpingEnemy(5, 20, 3, 3, new CG.Vector3(-20, 0, -200), new CG.Vector3(0,0,0), this);
            let jump3 = new CG.JumpingEnemy(5, 20, 3, 3, new CG.Vector3(20, 0, -200), new CG.Vector3(0,0,0), this);
        }

        if(this.counter*this.speed> 50 && !this.eventsDone[6])
        {
            this.eventsDone[6] = true;
            let line = new CG.EnemyLine(9, 1, 5, false, 20, 1, this);
        }

        if(this.counter*this.speed> 60 && !this.eventsDone[7])
        {
            this.eventsDone[7] = true;
            let line = new CG.EnemyLine(9, 2, 5, false, 20, 1, this);
        }

        if(this.counter*this.speed> 70 && !this.eventsDone[8])
        {
            this.eventsDone[8] = true;
            let line = new CG.EnemyLine(12, 3, 6, false, 50, 0.5, this);
        }

        if(this.counter*this.speed > 80 && !this.eventsDone[9])
        {
            this.eventsDone[9] = true;
            let jump1 = new CG.JumpingEnemy(10, 40, 6, 2, new CG.Vector3(0, 0, -200), new CG.Vector3(0,0,0), this);
            let jump4 = new CG.JumpingEnemy(10, 40, 6, 2, new CG.Vector3(10, 0, -200), new CG.Vector3(0,0,0), this);
            let jump5 = new CG.JumpingEnemy(10, 40, 6, 2, new CG.Vector3(-10, 0, -200), new CG.Vector3(0,0,0), this);
            let jump2 = new CG.JumpingEnemy(10, 40, 6, 2, new CG.Vector3(-20, 0, -200), new CG.Vector3(0,0,0), this);
            let jump3 = new CG.JumpingEnemy(10, 40, 6, 2, new CG.Vector3(20, 0, -200), new CG.Vector3(0,0,0), this);
        }

        if(this.counter*this.speed> 90 && !this.eventsDone[10])
        {
            this.eventsDone[10] = true;
            let line = new CG.EnemyLine(16, 5, 8, true, 30, 1, this);
            for(let i = 0; i < 11; i++)
            {
                this.eventsDone[i] = false;
                this.counter = 0;
                this.speed = 2;
            }
        }
    }
}