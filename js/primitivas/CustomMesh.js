    var CG =  CG || {};

/**
 * Crea un mesh a partir de un archivo obj
 */
CG.CustomMesh = class extends CG.Mesh{

    constructor(gl, initialTransform, objSource)
    {
        super(initialTransform);
        let path = "resources/models/" + objSource;
        
        fetch(path)
        .then((r) => r.text())
        .then((t) => {
            let content_line = t.split("\n");
            let initial_vertices = [];
      let initial_uvs = [];
      let initial_normals = [];
      let faces = [];
      let data;
      for (let i=0, l=content_line.length; i<l; i++) {
        // vertices
        if (content_line[i].startsWith("v ")) {
          data = content_line[i].split(" ");
          data.shift();
          initial_vertices.push(data);
        }

        // coordenadas de textura
        else if (content_line[i].startsWith("vt ")) {
          data = content_line[i].split(" ");
          data.shift();
          initial_uvs.push(data);
        }

        // normales
        else if (content_line[i].startsWith("vn ")) {
          data = content_line[i].split(" ");
          data.shift();
          initial_normals.push(data);
        }

        // caras
        else if (content_line[i].startsWith("f ")) {
          data = content_line[i].split(" ");
          data.shift();
          faces.push(data);
        }
      }

      let vertices = [];
      let uvs = [];
      let normals = [];
      let tmp1, tmp2, tmp3;
      for(let i=0,l=faces.length; i<l; i++) {
        // triángulo
        // if (faces[i].length === 3) {
          tmp1 = faces[i][0].split("/");
          tmp2 = faces[i][1].split("/");
          tmp3 = faces[i][2].split("/");

          // coordenadas de los vértices
          vertices.push(
            ...initial_vertices[parseInt(tmp1[0])-1], 
            ...initial_vertices[parseInt(tmp2[0])-1], 
            ...initial_vertices[parseInt(tmp3[0])-1]
          );

          // coordenadas de textura
          if (tmp1[1]) {
            uvs.push(
              ...initial_uvs[parseInt(tmp1[1])-1], 
              ...initial_uvs[parseInt(tmp2[1])-1], 
              ...initial_uvs[parseInt(tmp3[1])-1]
            );
          }

          // normales
          if (tmp1[2]) {
            normals.push(
              ...initial_normals[parseInt(tmp1[2])-1], 
              ...initial_normals[parseInt(tmp2[2])-1], 
              ...initial_normals[parseInt(tmp3[2])-1]
            );
          }
        // }
        // quads
        // else if (faces[i].length === 4) {
        // }
      }


      this.positionFlatBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionFlatBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      this.num_elements = vertices.length/3;

      if (uvs.length > 0) {
        this.uvFlatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvFlatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
      }

      if (normals.length > 0) {
        this.normalFlatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalFlatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.hasFlat = true;
        })
        .catch((error) => {
            console.error('Error fetching the file:', error);
        });

         // Optionally, log the result
    }

}