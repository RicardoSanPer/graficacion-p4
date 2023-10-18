var CG =  CG || {};

/**
 * Cono es igual a cilindro, excepto que se "elimina" el segmento superior para
 * que el vértice central cumpla el rol de punta.
 */
CG.Cono = class{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del cono (RGBA)
     * @param {Number} diameter Diametro del cono
     * @param {Number} height Altura del cono
     * @param {Number} nfaces Numero de caras en el cono
     * @param {Number} nsegments Numero de subdivisiones a lo largo de la altura
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, diameter, height, nfaces, nsegments, initial_transform)
    {
        this.g_radius  = (diameter || 1);
        this.g_height = (height || 1);
        //Establecer como minimo 3 caras
        this.nlados = (nfaces || 10);
        this.nlados = (this.nlados < 3)? 3 : this.nlados;
        //Establecer como segmentos minimo 0
        this.nsegments = (nsegments || 0);
        this.nsegments = (this.nsegments < 0)? 0 : this.nsegments; 
        this.nsegments += 2;

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

    /**
     * Calcula la posicion de los vértices
     */
    getVertices()
    {
        var pos = [];

        //El cono esencialmente se crea igual que un cilindro, excepto que se
        // la punta es el ultimo segmento con escala 0
        for(var j = 0; j < this.nsegments; j++)
        {    
            //Obtener la altura de cada segmento del cilindro
            var desiredH = (this.g_height * 2);
            //Factor de la altura para escalar
            var factor = (j/(this.nsegments-1));
            var h =  desiredH * factor;
            for(var i = 0; i < this.nlados; i++)
            {
                let theta = (i/this.nlados) *(Math.PI * 2);
                let x = Math.cos(theta) * this.g_radius * (1 - factor);
                let y = Math.sin(theta) * this.g_radius * (1 - factor);

                pos.push(x);
                pos.push(-this.g_height + h);
                pos.push(y);
            }
        }

        pos.push(0);
        pos.push(-this.g_height);
        pos .push(0);

        let faces = this.getFaces();
        let vertices = [];
        
        for (let i=0; i<faces.length; i++) {
            vertices.push(pos[faces[i]*3], pos[faces[i]*3 +1], pos[faces[i]*3 +2]);
        }
        
        return vertices;
    }

    /**Computa las caras */
    getFaces()
    {
        let faces = [];
        //Centro de la base
        let centroB = (this.nlados * (this.nsegments));
        
        // Obtener circulo base    
        for(var i = 0; i < this.nlados; i++)
        {
            let index = i % this.nlados;
            let index2  = (index + 1) % this.nlados;
            faces.push(centroB, index, index2);
        }
         
        //Lados del cono
        for(var j = 0; j < this.nsegments - 1; j++)
        {
            var h = (j * this.nlados);
            for(var i = 0; i < this.nlados; i++)
            {
                let index = h + (i % this.nlados);
                let index2  = h + ((index + 1) % this.nlados);
                let index3 = index + this.nlados;
                //Dibujar ambos triangulos de la cara
                faces.push(index, index3, index2);
                faces.push(index3, index2 + this.nlados, index2);
            }
        }
        return faces;
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