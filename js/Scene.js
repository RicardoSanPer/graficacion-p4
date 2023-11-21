var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.renderer = new CG.Renderer();
        this.gameobjects = {};
        this.player = new CG.Player(new CG.Vector3(0,-20,0), new CG.Vector3(-45,0,0), this)

        this.destroy = this.destroy.bind(this);
        this.spawn = this.spawn.bind(this);


        this.counter = 8;
        this.time = 8;
        

        document.addEventListener("elementDeleted", this.destroy);
        document.addEventListener("elementSpawn", this.spawn);
    }

    update(delta)
    {
        this.counter += delta;
        if(this.counter > this.time)
        {
            this.counter = 0;
            let en = new CG.EnemyLine(10, 1, 5, false, 10, 1, this);
        }
        for (const [key, value] of Object.entries(this.gameobjects))
        {
            value.update(delta);
            value.updateGeometry();
        }
        this.renderer.draw();
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
            var objeto = new CG.SpawnParticle(1, eventData.pos.clone(), eventData.rot.clone(), this);
        }  
    }
}