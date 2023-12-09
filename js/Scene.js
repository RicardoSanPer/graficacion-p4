var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.canvas = document.getElementById("the_canvas");
        this.gl = this.canvas.getContext("webgl");
        if(!this.gl)
        {
            throw "WebGL no soportado";
        }

        this.gameobjects = {};

        this.destroy = this.destroy.bind(this);
        this.spawn = this.spawn.bind(this);

        document.addEventListener("elementDeleted", this.destroy);
        document.addEventListener("elementSpawn", this.spawn);

        this.bgmusic = new Audio("/resources/audio/bg.mp3");
        this.bgmusic.loop = true;
        this.bgmusic.play();
        
        this.counter = 0;
        this.enemyCount = 5;
        this.enemyProgress = 0;
        this.time = 2;
        
        this.camara = new CG.CamaraCOI(this.canvas,50, new CG.Vector3(0,0,0));
        this.lightDir = new CG.LuzDireccional();
        this.player = new CG.Player(new CG.Vector3(0,-20,0), new CG.Vector3(-45,0,0), this);

        this.skybox = new CG.Skybox(this.gl, CG.Matrix4.scale(new CG.Vector3(500, 500, 500) ), "bg2.png");
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
        let cameraPos = this.camara.position;

        let lightpos = this.camara.viewMatrix.multiplyVector(this.lightDir.position);

        for (const [key, value] of Object.entries(this.gameobjects))
        {
            value.update(delta);
            value.updateGeometry();
            value.draw(this.gl, this.camara);
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
            var objeto = new CG.Projectile(eventData.pos.clone(), eventData.rot.clone(), this);
        }
        else if(eventData.objeto == "SpawnParticle")
        {
            var objeto = new CG.SpawnParticle(eventData.name, eventData.scale, eventData.duration, eventData.pos.clone(), eventData.rot.clone(), this);
        }  
    }
}