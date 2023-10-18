var CG =  CG || {};

CG.Dodecaedro = class{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del dodecaedro (RGBA)
     * @param {Number} length radio del dodecaedro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, length ,initial_transform)
    {
        this.g_length  = (length || 1)/2;

        this.initial_transform = initial_transform || new CG.Matrix4();
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
        let l = this.g_length;
        let phi = (1 + Math.sqrt(5))/2;
        var pos = [
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