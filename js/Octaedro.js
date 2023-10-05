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
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.color = color;

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

        this.num_elements = this.faces.length;
    }

    draw(gl, positionAttributeLocation, colorUniformLocation, PVM_matrixLocation, projectionViewMatrix) {
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
        gl.uniform4fv(colorUniformLocation, this.color);
        
        let projectionViewModelMatrix = CG.Matrix4.multiply(projectionViewMatrix, this.initial_transform);
  
        gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toArray());
  
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        //gl.drawElements(gl.LINE_STRIP, this.num_elements, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);
    }

    getVertices()
    {
        return[
            0, -this.g_length, 0,
            this.g_length, 0, 0,
            0, 0, this.g_length,
            -this.g_length, 0, 0,
            0, 0, -this.g_length,
            0, this.g_length, 0,
        ];
    }

    getFaces()
    {
        return[
            0,1,2,
            0,2,3,
            0,3,4,
            0,4,1,

            5,1,2,
            5,2,3,
            5,3,4,
            5,4,1
        ]
    }
}