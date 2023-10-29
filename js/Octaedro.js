var CG =  CG || {};

CG.Octaedro = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del octaedro (RGBA)
     * @param {Number} length radio del octaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform, texture, normal, specular)
    {
        super(gl, color, initial_transform, texture, normal, specular);
        this.g_length  = (length || 1);

        this.setFlatBuffer(gl);
    }

    getFlatVertices()
    {
        let pos = [
            0, -this.g_length, 0,
            this.g_length, 0, 0,
            0, 0, this.g_length,
            -this.g_length, 0, 0,
            0, 0, -this.g_length,
            0, this.g_length, 0,
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
            0,1,2,
            0,2,3,
            0,3,4,
            0,4,1,

            5,2,1,
            5,3,2,
            5,4,3,
            5,1,4
        ]
    }

    getFlatUV()
    {
        let uv = [ 0.125,1, 0.25,0.5, 0,0.5, 
            0.875,1, 1,0.5, 0.75,0.5,
            0.625,1, 0.75,0.5, 0.5,0.5,
            0.375,1, 0.5,0.5, 0.25,0.5,

            0.125,0, 0,0.5, 0.25,0.5,
            0.875,0,  0.75,0.5, 1,0.5,
            0.625,0,  0.5,0.5, 0.75,0.5,
            0.375,0,  0.25,0.5, 0.5,0.5,
        ];
        return uv;
    }
    
    drawGeometry(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation)
    {
        this.drawFlat(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation);
    }
}