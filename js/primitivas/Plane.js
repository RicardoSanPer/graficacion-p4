var CG =  CG || {};

CG.Plane = class extends CG.Mesh
{
    constructor(gl, color, width, height ,initial_transform)
    {
        super(initial_transform);
        this.g_length  = (length || 1);

        this.width = width / 2;
        this.height = height / 2;
        this.setFlatBuffer(gl);
    }
    getFlatVertices()
    {
        let pos = [
            -this.width, this.height,0,
            this.width, this.height, 0,
            -this.width, -this.height, 0,
            this.width, -this.height, 0,
        ];

        let faces = this.getFlatFaces();
        let vertices = [];
        
        for (let i=0; i<faces.length; i++) {
            vertices.push(pos[faces[i]*3], pos[faces[i]*3 +1], pos[faces[i]*3 +2]);
        }
        return vertices;
    }

    getFlatFaces()
    {
        return[
            0,2,1,
            2,3,1
        ]
    }

    getFlatUV()
    {
        let uv = [ 0,1, 0,0, 1,1, 
            1,1, 1,0, 0,0,
        ];
        return uv;
    }
}