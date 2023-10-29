var CG =  CG || {};

CG.Dodecaedro = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del dodecaedro (RGBA)
     * @param {Number} length radio del dodecaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform, texture, normal, specular)
    {
        super(gl, color, initial_transform, texture, normal, specular);
        this.g_length  = (length || 1)/2;

        this.setFlatBuffer(gl);
    }

    getFlatVertices()
    {
        let l = this.g_length;
        let phi = (1 + Math.sqrt(5))/2;
        var pos = [
        l,l,l, //a 0
        l,l,-l, //b 1
        l,-l,l, //c 2
        -l,l,l, //d 3
        l,-l,-l, //e 4
        -l,l,-l, //f 5
        -l,-l,l, //g 6
        -l,-l,-l, //h 7
        
        0,l/phi, l*phi, //i 8
        0,l/phi,-l*phi, //j 9
        0,-l/phi,l*phi, //k 10
        0,-l/phi,-l*phi, //l 11

        l/phi, l*phi,0, //m 12
        l/phi,-l*phi,0, //n 13
        -l/phi,l*phi,0, //o 14
        -l/phi,-l*phi,0, //p 15

        l*phi,0, l/phi, //q 16
        l*phi,0,-l/phi, //r 17
        -l*phi,0,l/phi, //s 18
        -l*phi,0,-l/phi, //t 19
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
            0, 12, 14,
            0, 14, 3,
            0, 3, 8,
            
            8, 3, 18,
            8, 18, 6,
            8, 6, 10,

            0, 8, 10,
            0, 10, 2,
            0, 2, 16,

            0, 16, 17,
            0, 17, 1,
            0, 1, 12,
            
            16, 2, 13,
            16, 13, 4,
            16, 4, 17,

            10, 6, 15,
            10, 15, 13,
            10, 13, 2,

            6, 18, 19,
            6, 19, 7,
            6, 7, 15,

            3, 14, 5,
            3, 5, 19,
            3, 19, 18,

            12, 1, 9,
            12, 9, 5,
            12, 5, 14,

            19, 5, 9,
            19, 9, 11,
            19, 11, 7,

            15, 7, 11,
            15, 11, 4,
            15, 4, 13,

            17, 4, 11,
            17, 11, 9,
            17, 9, 1,
        ];
    }

    getFlatUV()
    {
        let uv = [];
        let theta1 = (1/5) * (Math.PI * 2);
        let theta2 = (2/5) * (Math.PI * 2);

        let x1 = (Math.sin(theta1) / 2) + 0.5;
        let y1 = (Math.cos(theta1) / 2) + 0.5;

        let x2 = (Math.sin(theta2) / 2) + 0.5;
        let y2 = (Math.cos(theta2) / 2) + 0.5;
        for(let i = 0; i < 12; i++)
        {
            uv.push(0.5,0,1-x1,1-y1,1-x2,1-y2,
                
                    0.5,0,1-x2,1-y2, x2,1-y2,
                    0.5,0, x2,1-y2, x1,1-y1,
                    );
        }
        return uv;
    }

    drawGeometry(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation)
    {
        this.drawFlat(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation);
    }
}