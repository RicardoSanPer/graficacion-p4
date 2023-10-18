var CG =  CG || {};

CG.Octaedro = class{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del octaedro (RGBA)
     * @param {Number} length radio del octaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform)
    {
        this.g_length  = (length || 1);

        this.initial_transform = initial_transform || new CG.Matrix4();

        this.vertices = this.getVertices();
        this.faces = this.getFaces();
        this.positionBuffer = gl.createBuffer();
        this.color = color;


        let vertices = this.getVertices();
        let normals = this.getNormals(vertices);

        // creación del buffer de datos del prisma
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // creación del buffer de normales del prisma
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        // número de elementos que define el prisma
        this.num_elements = vertices.length/3;
    }

    draw(gl, positionAttributeLocation, normalAttributeLocation, colorUniformLocation, PVM_matrixLocation, VM_matrixLocation, projectionMatrix, viewMatrix) {
        // el buffer de posiciones
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
        // el buffer de normales
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
        // el color
        gl.uniform4fv(colorUniformLocation, this.color);
        
        // VM_matrixLocation
        let viewModelMatrix = CG.Matrix4.multiply(viewMatrix, this.initial_transform);
        gl.uniformMatrix4fv(VM_matrixLocation, false, viewModelMatrix.toArray());
  
        // PVM_matrixLocation
        let projectionViewModelMatrix = CG.Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toArray());
  
        // dibujado
        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
      }
  
      //Dibuja wireframe
      drawWireframe()
      {
        gl.uniform4fv(colorUniformLocation, [0,0,0,1]);
        gl.drawArrays(gl.LINE_STRIP, 0, this.num_elements);
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