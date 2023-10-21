var CG = (function(CG) {
  let g_width, g_height, g_length;

  class PrismaRectangular extends CG.Mesh {
    /**
     */
    constructor(gl, color, width, height, length, initial_transform) {
      g_width  = (width  || 1)/2;
      g_height = (height || 1)/2;
      g_length = (length || 1)/2;
      
      super(color, initial_transform);

      this.setBuffers(gl);
      
    }

    getVertices() {
      
      let pos = [
          g_width,  g_height,  g_length,
          g_width, -g_height,  g_length,
          g_width,  g_height, -g_length,
          g_width, -g_height, -g_length,
        -g_width,  g_height,  g_length,
        -g_width, -g_height,  g_length,
        -g_width,  g_height, -g_length,
        -g_width, -g_height, -g_length
      ];

      let faces = this.getFaces();
      let vertices = [];
      
      for (let i=0; i<faces.length; i++) {
        vertices.push(pos[faces[i]*3], pos[faces[i]*3 +1], pos[faces[i]*3 +2]);
      }
      return vertices;
    }
    getFaces() {
      return [
        0, 2, 6,
        0, 6, 4,

        4,6,7,
        4,7,5,

        5,7,3,
        5,3,1,

        1,3,2,
        1,2,0,

        5,1,0,
        5,0,4,

        3,7,6,
        3,6,2,
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


  CG.PrismaRectangular = PrismaRectangular;
  return CG;
})(CG || {});