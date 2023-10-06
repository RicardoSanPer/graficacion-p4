var CG =  CG || {};

CG.Dodecaedro = class{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del icosaedro (RGBA)
     * @param {Number} length radio del icosaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform)
    {
        this.g_length  = (length || 1)/2;

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
        let l = this.g_length;
        let phi = (1 + Math.sqrt(5))/2;
        var vertices = [
        l,l,l, //a 0
        l,l,-l, //b 1
        l,-l,l, //c 2
        -l,l,l, //d 3
        l,-l,-l, //e 4
        -l,l,-l, //f 5
        -l,-l,l, //g 6
        -l,-l,-l, //h 7
        
        0,l/phi, l*phi, //i 8
        0,l/phi,-l*phi, //j 9
        0,-l/phi,l*phi, //k 10
        0,-l/phi,-l*phi, //l 11

        l/phi, l*phi,0, //m 12
        l/phi,-l*phi,0, //n 13
        -l/phi,l*phi,0, //o 14
        -l/phi,-l*phi,0, //p 15

        l*phi,0, l/phi, //q 16
        l*phi,0,-l/phi, //r 17
        -l*phi,0,l/phi, //s 18
        -l*phi,0,-l/phi, //t 19
        ];

        return vertices;
    }

    getFaces()
    {
        return[
            0, 12, 14,
            0, 14, 3,
            0, 3, 8,
            
            8, 3, 18,
            8, 18, 6,
            8, 6, 10,

            0, 8, 10,
            0, 10, 2,
            0, 2, 16,

            0, 16, 17,
            0, 17, 1,
            0, 1, 12,
            
            16, 2, 13,
            16, 13, 4,
            16, 4, 17,

            10, 6, 15,
            10, 15, 13,
            10, 13, 2,

            6, 18, 19,
            6, 19, 7,
            6, 7, 15,

            3, 14, 5,
            3, 5, 19,
            3, 19, 18,

            12, 1, 9,
            12, 9, 5,
            12, 5, 14,

            19, 5, 9,
            19, 9, 11,
            19, 11, 7,

            15, 7, 11,
            15, 11, 4,
            15, 4, 13,

            17, 4, 11,
            17, 11, 9,
            17, 9, 1,
        ];
    }
}