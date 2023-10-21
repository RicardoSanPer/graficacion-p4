var CG =  CG || {};

CG.Mesh = class{

    constructor(color, initial_transform) {
        
        this.color = color;
        this.initial_transform = initial_transform || new CG.Matrix4();

        this.translation = new CG.Vector3(0,0,0);
        this.rotation = new CG.Vector3(0,0,0);
        this.scaleV = new CG.Vector3(1,1,1);

        this.transformMatrix = new CG.Matrix4();
  
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
        
        let transform = CG.Matrix4.multiply(this.initial_transform, this.transformMatrix);
        // VM_matrixLocation
        let viewModelMatrix = CG.Matrix4.multiply(viewMatrix, transform);
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

      setRotation(x,y,z)
      {
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.rotation.set(x,y,z);

        this.updateTransformMatrix();
      }
      setTranslation(x,y,z)
      {
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.translation.set(x,y,z);
        this.updateTransformMatrix();
      }
      setScale(x,y,z)
      {
        x = (x || 1);
        y = (y || 1);
        z = (z || 1);

        this.scaleV.set(x,y,z);
        this.updateTransformMatrix();
      }

      Rotate(x,y,z)
      {

        let conversion = Math.PI / 180;
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.rotation.x += x * conversion;
        this.rotation.y += y * conversion;
        this.rotation.z += z * conversion;

        this.updateTransformMatrix();
      }

      Translate(x,y,z)
      {

        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.rotation.x += x;
        this.rotation.y += y;
        this.rotation.z += z;

        this.updateTransformMatrix();
      }

      updateTransformMatrix()
      {
        this.transformMatrix = CG.Matrix4.scale(this.scaleV);
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.translate(this.translation));
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.rotateX(this.rotation.x));
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.rotateY(this.rotation.y));
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.rotateZ(this.rotation.z));
      }
}