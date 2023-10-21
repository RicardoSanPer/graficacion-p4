var CG =  CG || {};

CG.Mesh = class{

    constructor(color, initial_transform) {
        
        this.color = color;
        this.initial_transform = initial_transform || new CG.Matrix4();
  
      }

      setBuffers(gl)
      {
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

      draw(gl, positionAttributeLocation, normalAttributeLocation, colorUniformLocation, PVM_matrixLocation, VM_matrixLocation, projectionMatrix, viewMatrix) 
      {
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

      getVertices()
      {
        return [];
      }

      getFaces()
      {
        return [];
      }

      getNormals(vertices)
      {
        return [];
      }
}