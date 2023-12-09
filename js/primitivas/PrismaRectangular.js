var CG = (function(CG) {
  let g_width, g_height, g_length;

  class PrismaRectangular extends CG.Mesh {
    /**
     */
    constructor(gl, color, width, height, length, initial_transform, texture, normal, specular) {
      g_width  = (width  || 1)/2;
      g_height = (height || 1)/2;
      g_length = (length || 1)/2;
      
      super(initial_transform);

      this.setFlatBuffer(gl);      
    }

    getFlatVertices() {
      
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

      let faces = this.getFlatFaces();
      let vertices = [];
      
      for (let i=0; i<faces.length; i++) {
          vertices.push(pos[faces[i]*3], pos[faces[i]*3 +1], pos[faces[i]*3 +2]);
      }

      return vertices;
    }
    getFlatFaces() {
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

    getFlatUV()
    {
      let uv = [];
      uv.push(
        1,0, 0,0, 0,1,
        1,0, 0,1, 1,1,
        
        1,0, 0,0, 0,1,
        1,0, 0,1, 1,1,

        0,1, 1,1, 1,0,
        0,1, 1,0, 0,0,

        0,1, 1,1, 1,0,
        0,1, 1,0, 0,0,

        0,1, 1,1, 1,0,
        0,1, 1,0, 0,0,

        0,1, 1,1, 1,0,
        0,1, 1,0, 0,0,
      )
      return uv;
    }


  }
  CG.PrismaRectangular = PrismaRectangular;
  return CG;
})(CG || {});