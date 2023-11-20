var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.renderer = new CG.Renderer();
        this.gameobjects = {};
        this.player = new CG.Player(new CG.Vector3(0,-20,0), new CG.Vector3(-45,0,0), this.renderer)
        this.gameobjects[this.player.id] = this.player;

        this.destroy = this.destroy.bind(this);
        this.spawn = this.spawn.bind(this);

        let earth = new CG.Esfera(
            this.renderer.gl, 
            [0, 1, 1, 1], 
            250, 64, 64, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
            "earth.jpg","earth_normal2.jpg","earth_specular.jpg",
            );
            earth.setTranslation(-160, -300, -100);
            earth.Rotate(25,0,0);
        this.renderer.add("earth_bg", 
        earth)

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