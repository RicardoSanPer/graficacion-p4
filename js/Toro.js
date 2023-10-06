var CG =  CG || {};

CG.Toro = class{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del cilindro (RGBA)
     * @param {Number} diameter Diametro del toro
     * @param {Number} height Altura de la circunferencia
     * @param {Number} nfaces Numero de caras en la circunderencia
     * @param {Number} nsegments Numero de subdivisiones en el toro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, diametroi, diametroe, nfaces, nsegments, initial_transform)
    {
        this.diametroInterno  = (diametroi || 1)/2;
        this.diametroExterno = (diametroe || 1)/2;
        //Establecer como minimo 3 caras
        this.nlados = (nfaces || 10);
        this.nlados = (this.nlados < 3)? 3 : this.nlados;
        //Establecer como segmentos minimo 0
        this.nsegments = (nsegments || 10);
        this.nsegments = (this.nsegments < 0)? 3 : this.nsegments;

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

    /**Computa la posicion de los vertices */
    calcularVertices()
    {
        this.vertices = [];
        //Dibujar el toso
        for(var j = 0; j < this.nsegments; j++)
        {    
            let theta = Math.PI * 2 * (j/this.nsegments);
            let currRad = this.diametroInterno + this.diametroExterno * Math.cos(theta);
            let y = Math.sin(theta) * this.diametroExterno;
            
            for(var i = 0; i < this.nlados; i++)
            {
                let theta2 = (i/this.nlados) *(Math.PI * 2);
                let x = currRad * Math.sin(theta2);
                let z = currRad * Math.cos(theta2);

                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);
            }
        }
    }

    /**Computa las caras */
    calcularCaras()
    {
        this.faces = [];
        //Segmentos del toro
        for(var j = 0; j < this.nsegments-1; j++)
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
        //Dibujar las ultimas caras
        h = ((this.nsegments-1) * this.nlados);
        for(var i = 0; i < this.nlados; i++)
        {
            let index = h + (i % this.nlados);
            let index2  = h + ((index + 1) % this.nlados);
            let index3 = (index + this.nlados)%this.nlados;
            //Dibujar ambos triangulos de la cara
            this.faces.push(index, index2, index3);
            this.faces.push(index3, (index2 + this.nlados) % this.nlados, index2);
        }
    }
}