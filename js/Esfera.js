var CG =  CG || {};

CG.Esfera = class{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color de la esfera (RGBA)
     * @param {Number} height radio de la esfera
     * @param {Number} nfaces Numero de segmentos horizontales de la esfera
     * @param {Number} nsegments Numero de subdivisiones a lo largo de la altura
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, radius, nfaces, nsegments, initial_transform)
    {
        this.g_radius  = (radius || 1);
        //Establecer como minimo 3 caras
        this.nlados = (nfaces || 10);
        this.nlados = (this.nlados < 3)? 3 : this.nlados;
        //Establecer como segmentos minimo 1
        this.nsegments = (nsegments || 1);
        this.nsegments = (this.nsegments < 1)? 1 : this.nsegments;
        this.nsegments += 2;

        this.initial_transform = initial_transform || new CG.Matrix4();

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
        this.calcularVertices();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.color = color;

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.calcularCaras();
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

    /**Computa la posicion de los vertices */
    calcularVertices()
    {
        this.vertices = [];

        for(var j = 0; j < this.nsegments; j++)
        {    
            var factor = (j/(this.nsegments-1));
            //Obtener la altura de cada segmento de la esfera
            var desiredH = (this.g_radius * 2);
            var h =  desiredH *  (j/(this.nsegments-1));
            for(var i = 0; i < this.nlados; i++)
            {
                let theta = (i/this.nlados) *(Math.PI * 2);
                let x = Math.cos(theta) * this.g_radius * Math.sin(Math.PI * factor);
                let y = Math.sin(theta) * this.g_radius * Math.sin(Math.PI * factor);

                this.vertices.push(x);
                this.vertices.push(-this.g_radius + h);
                this.vertices.push(y);
            }
        }
    }

    /**Computa las caras */
    calcularCaras()
    {
        this.faces = [];
        

        //Esfera
        for(var j = 0; j < this.nsegments - 1; j++)
        {
            var h = (j * this.nlados);
            for(var i = 0; i < this.nlados; i++)
            {
                let index = h + (i % this.nlados);
                let index2  = h + ((index + 1) % this.nlados);
                let index3 = index + this.nlados;
                //Dibujar ambos triangulos de la cara
                this.faces.push(index, index2, index3);
                this.faces.push(index3, index2 + this.nlados, index2);
            }
        }
    }
}