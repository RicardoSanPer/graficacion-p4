var CG =  CG || {};

CG.EnemyLine = class
{
    /**
     * 
     * @param {Number} xsquares Numero de cuadros en la casilla
     * @param {Number} nlines Numero de lineas
     * @param {Number} nenemigos Numero de enemigos por linea
     * @param {*} alternar 
     * @param {Number} moveSpeed Velocidad de movimiento
     * @param {Number} pauseTime Tiempo de pausa
     * @param {Scene} scene 
     * @param {Renderer} renderer 
     */
    constructor(xsquares, nlines, nenemigos, alternar, moveSpeed, pauseTime, scene)
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
                
                let x = this.xmin + this.squareOffset + (this.squareSize * j);
                let pos = new CG.Vector3(x,-20,-200 + (-10 * i));
                let rot = new CG.Vector3(90,0,0);
                let enemigo = new CG.BasicEnemy(xsquares,j,1,j,this.xsquares - (nenemigos- j), moveSpeed,pauseTime,pos,rot, scene);
                pos.x += this.squareSize;
                document.dispatchEvent(new CustomEvent("elementSpawn",{detail: 
                    {objeto : "SpawnParticle",
                        pos : new CG.Vector3(pos.x, pos.y, pos.z+5),
                        rot : new CG.Vector3(0,0,0),
                    },
                }));
            }
        }
    }
}