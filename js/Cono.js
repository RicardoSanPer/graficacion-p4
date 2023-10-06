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
        gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);

        gl.uniform4fv(colorUniformLocation, [0,0,0,1]);
        gl.drawElements(gl.LINE_STRIP, this.num_elements, gl.UNSIGNED_SHORT, 0);
      }

    /**
     * Calcula la posicion de los vértices
     */
    calcularVertices()
    {
        this.vertices = [];

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

                this.vertices.push(x);
                this.vertices.push(-this.g_height + h);
                this.vertices.push(y);
            }
        }

        this.vertices.push(0);
        this.vertices.push(-this.g_height);
        this.vertices.push(0);
    }

    /**Computa las caras */
    calcularCaras()
    {
        this.faces = [];
        //Centro de la base
        let centroB = (this.nlados * (this.nsegments));
        
        // Obtener circulo base    
        for(var i = 0; i < this.nlados; i++)
        {
            let index = i % this.nlados;
            let index2  = (index + 1) % this.nlados;
            this.faces.push(centroB, index, index2);
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
                this.faces.push(index, index2, index3);
                this.faces.push(index3, index2 + this.nlados, index2);
            }
        }
    }
}