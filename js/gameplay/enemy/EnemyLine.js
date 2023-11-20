var CG =  CG || {};

CG.EnemyLine = class
{
    constructor(xsquares, nlines, nenemigos, alternar, moveSpeed, pauseTime, scene, renderer)
    {
        let dir = 1;
        for(let i = 0; i < nlines; i++)
        {
            if(alternar)
            {
                dir *= -1;
            }
            for(let j = 0; j < nenemigos; j++)
            {
                let enemigo = new CG.BasicEnemy(xsquares, j+1, dir, j+1, xsquares - (nenemigos - j+1), moveSpeed, pauseTime, new CG.Vector3(0,-20,-300 + 10 * i), new CG.Vector3(0,0,0), renderer);
                scene.gameobjects[enemigo.id] = enemigo;
            }
        }
    }
}