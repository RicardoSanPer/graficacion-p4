var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.renderer = new CG.Renderer();
        this.gameobjects = {};
        this.player = new CG.Player(new CG.Vector3(0,-20,0), new CG.Vector3(-45,0,0), this.renderer)
        this.gameobjects[this.player.id] = this.player;
        
        let enLine = new CG.EnemyLine(10, 2, 7, false, 10, 0, this, this.renderer);

        this.destroy = this.destroy.bind(this);
        this.spawn = this.spawn.bind(this);

        

        document.addEventListener("elementDeleted", this.destroy);
        document.addEventListener("elementSpawn", this.spawn);
    }

    update(delta)
    {
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
            var objeto = new CG.Projectile(eventData.pos.clone(), eventData.rot.clone(), this.renderer);
        }   
        this.renderer.add(objeto.id, objeto.mesh);
        this.gameobjects[objeto.id] = objeto;
    }
}