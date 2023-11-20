var CG =  CG || {};

CG.EnemyLine = class
{
    constructor(xsquares, nlines, nenemigos, alternar, moveSpeed, pauseTime, scene, renderer)
    {
        let dir = 1;
        
        this.xmin = -35;
        this.width = 70;
        this.xsquares = xsquares;
        this.squareSize = this.width / this.xsquares;
        this.squareOffset = this.squareSize / 2;
        this.currentSquare = 0;
        
        for(let i = 0; i < nlines; i++)
        {
            if(alternar)
            {
                dir *= -1;
            }
            for(let j = 0; j < nenemigos; j++)
            {
                let x = this.xmin + this.squareOffset + (this.squareSize * j)
                let pos = new CG.Vector3(x,-20,- 40 + (-10 * i));
                let rot = new CG.Vector3(0,0,0);
                let enemigo = new CG.BasicEnemy(xsquares,j,1,j,this.xsquares - (nenemigos- j), moveSpeed,pauseTime,pos,rot, renderer);
                scene.gameobjects[enemigo.id] = enemigo;
            }
        }
    }
}