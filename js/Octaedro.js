var CG =  CG || {};

CG.Octaedro = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del octaedro (RGBA)
     * @param {Number} length radio del octaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform)
    {
        super(color, initial_transform);
        this.g_length  = (length || 1);

        this.setBuffers(gl);
    }

    getVertices()
    {
        let pos = [
            0, -this.g_length, 0,
            this.g_length, 0, 0,
            0, 0, this.g_length,
            -this.g_length, 0, 0,
            0, 0, -this.g_length,
            0, this.g_length, 0,
        ];

        let faces = this.getFaces();
        let vertices = [];
        
        for (let i=0; i<faces.length; i++) {
            vertices.push(pos[faces[i]*3], pos[faces[i]*3 +1], pos[faces[i]*3 +2]);
        }
        return vertices;
    }

    getFaces()
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

    getNormals(vertices) {
        let normals = [];
        let v1 = new CG.Vector3();
        let v2 = new CG.Vector3();
        let v3 = new CG.Vector3();
        let n;
      
        for (let i=0; i<vertices.length; i+=9) {
          v1.set( vertices[i  ], vertices[i+1], vertices[i+2] );
          v2.set( vertices[i+3], vertices[i+4], vertices[i+5] );
          v3.set( vertices[i+6], vertices[i+7], vertices[i+8] );
          n = CG.Vector3.cross(CG.Vector3.substract(v1, v2), CG.Vector3.substract(v2, v3)).normalize();
          normals.push(
            n.x, n.y, n.z, 
            n.x, n.y, n.z, 
            n.x, n.y, n.z
          );
        }
  
        return normals;
      }
}