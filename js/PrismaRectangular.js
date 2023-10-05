var CG = (function(CG) {
  let g_width, g_height, g_length;

  class PrismaRectangular {
    /**
     */
    constructor(gl, color, width, height, length, initial_transform) {
      g_width  = (width  || 1)/2;
      g_height = (height || 1)/2;
      g_length = (length || 1)/2;
      
      this.initial_transform = initial_transform || new CG.Matrix4();

      this.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

      let vertices = this.getVertices();
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      this.color = color;

      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

      let faces = this.getFaces();
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

      this.num_elements = faces.length;
    }

    draw(gl, positionAttributeLocation, colorUniformLocation, PVM_matrixLocation, projectionViewMatrix) {
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

      gl.uniform4fv(colorUniformLocation, this.color);
      
      let projectionViewModelMatrix = CG.Matrix4.multiply(projectionViewMatrix, this.initial_transform);

      gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toArray());

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.drawElements(gl.LINE_STRIP, this.num_elements, gl.UNSIGNED_SHORT, 0);
    }

    getVertices() {
      return [
          g_width,  g_height,  g_length,
          g_width, -g_height,  g_length,
          g_width,  g_height, -g_length,
          g_width, -g_height, -g_length,
        -g_width,  g_height,  g_length,
        -g_width, -g_height,  g_length,
        -g_width,  g_height, -g_length,
        -g_width, -g_height, -g_length
      ];
    }
    getFaces() {
      return [
        2, 1, 3,
        2, 0, 1,

        1, 4, 5,
        1, 0, 4,

        5, 6, 7,
        5, 4, 6,

        6, 3, 7,
        6, 2, 3,

        4, 2, 6,
        4, 0, 2,

        3, 5, 7,
        3, 1, 5,
      ];
    }
  }

  CG.PrismaRectangular = PrismaRectangular;
  return CG;
})(CG || {});