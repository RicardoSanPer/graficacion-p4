var CG =  CG || {};

CG.Scene = class{
    constructor()
    {
        this.renderer = new CG.Renderer();
        this.renderer.pushGeometry(new CG.PrismaRectangular(
            this.renderer.gl, 
            [1, 0.2, 0.3, 1], 
            3, 3, 30, 
            CG.Matrix4.translate(new CG.Vector3(-50, 0, 0)),
            ))
        this.renderer.pushGeometry(new CG.PrismaRectangular(
                this.renderer.gl, 
                [1, 0.2, 0.3, 1], 
                3, 3, 30, 
                CG.Matrix4.translate(new CG.Vector3(50, 0, 0)),
                ))

        this.gameobjects = [];
        this.player = new CG.Player([0,0,0], [0,0,0], this.renderer)
        this.gameobjects.push(this.player);

        this.dir = 1;
    }

    update(delta)
    {
        for(let i = 0; i < this.gameobjects.length; i++)
        {
            this.gameobjects[i].update(delta);
            this.gameobjects[i].updateGeometry();
        }
        
        this.renderer.draw();
    }

    passInput(input)
    {
        this.player.passInput(input);
    }
}