var CG =  CG || {};

CG.Icosaedro = class{

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

    /**
     * 
     * @param {*} gl  El contexto de render de WebGL
     * @param {*} positionAttributeLocation  El apuntador a la variable a_position en los shaders
     * @param {*} normalAttributeLocation  El apuntador a la variable a_normal en los shaders
     * @param {*} colorUniformLocation  El apuntador a la variable u_color en los shaders
     * @param {*} PVM_matrixLocation  El apuntador a la variable u_PVM_matrix (transformación del modelo+vista+proyección)
     * @param {*} VM_matrixLocation  El apuntador a la variable u_VM_matrix (transformación del modelo+vista)
     * @param {*} projectionMatrix  Matriz de proyección
     * @param {*} viewMatrix  Matriz de la vista
     */
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
        var pos = [];
        var y = Math.sin(Math.PI / 6) * this.g_length;
        pos.push(0, -this.g_length, 0);
        for(var i = 0; i < 5; i++)
        {
            var factor = Math.PI * 2 * i / 5;
            var x = Math.sin(factor) * this.g_length;
            var z = Math.cos(factor) * this.g_length;
            pos.push(x,-y,z);
        }

        var displace = Math.PI / 5;
        for(var i = 0; i < 5; i++)
        {
            var factor = Math.PI * 2 * i / 5;
            var x = Math.sin(factor + displace) * this.g_length;
            var z = Math.cos(factor + displace) * this.g_length;
            pos.push(x,y,z);
        }
        pos.push(0, this.g_length, 0);

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
            
            0,2,1,
            0,3,2,
            0,4,3,
            0,5,4,
            0,1,5,
            
            1,2,6,
            6,2,7,
            2,3,7,
            7,3,8,
            3,4,8,
            8,4,9,
            4,5,9,
            9,5,10,
            5,1,10,
            10,1,6,

            6,7,11,
            7,8,11,
            8,9,11,
            9,10,11,
            10,6,11,
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