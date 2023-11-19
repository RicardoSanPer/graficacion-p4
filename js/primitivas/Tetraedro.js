var CG =  CG || {};

CG.Tetraedro = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del tetraedro (RGBA)
     * @param {Number} length radio del tetraedro
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
        var pos = [];
        pos.push(0, this.g_length, 0);

        var y = Math.sin(-Math.PI/6) * this.g_length;
        for(var i = 0; i < 3; i++)
        {
            var x = Math.cos(Math.PI * i * 2 / 3)* this.g_length;
            var z = Math.sin(Math.PI * i * 2 / 3)* this.g_length;

            pos.push(x,y,z);
        }

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
            0,3,2,
            0,1,3,
            1,2,3,
            
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
      getFlatUV()
      {
        let uv = [0.5,0, 0,1, 1,1,
            0.5,0, 0,1, 1,1,
            0.5,0, 0,1, 1,1,
            0.5,0, 0,1, 1,1];
        return uv;
      }
      drawGeometry(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation)
      {
          this.drawFlat(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation);
      }
}