var CG =  CG || {};

CG.Icosaedro = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del icosaedro (RGBA)
     * @param {Number} length radio del icosaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform)
    {
      super(color, initial_transform);
        this.g_length  = (length || 1)/2;

        this.initial_transform = initial_transform || new CG.Matrix4();
        this.color = color;

        this.setBuffers(gl);
    }

    getVertices()
    {
        var pos = [];
        var y = Math.sin(Math.PI / 6) * this.g_length;
        pos.push(0, -this.g_length, 0);
        for(var i = 0; i < 5; i++)
        {
            var factor = Math.PI * 2 * i / 5;
            var x = Math.sin(factor) * this.g_length;
            var z = Math.cos(factor) * this.g_length;
            pos.push(x,-y,z);
        }

        var displace = Math.PI / 5;
        for(var i = 0; i < 5; i++)
        {
            var factor = Math.PI * 2 * i / 5;
            var x = Math.sin(factor + displace) * this.g_length;
            var z = Math.cos(factor + displace) * this.g_length;
            pos.push(x,y,z);
        }
        pos.push(0, this.g_length, 0);

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
            
            0,2,1,
            0,3,2,
            0,4,3,
            0,5,4,
            0,1,5,
            
            1,2,6,
            6,2,7,
            2,3,7,
            7,3,8,
            3,4,8,
            8,4,9,
            4,5,9,
            9,5,10,
            5,1,10,
            10,1,6,

            6,7,11,
            7,8,11,
            8,9,11,
            9,10,11,
            10,6,11,
        ];
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