var CG = CG || {};
//Skybox
CG.Skybox = class{
    constructor(gl, initial_transform, texturesrc)
    {
        this.initial_transform = initial_transform || new CG.Matrix4();
        this.nlados = 16;
        this.nsegments = 16;
        this.g_radius = 1;
        let path = "resources/textures/";
        texturesrc = (texturesrc || "bg2.png");
        texturesrc = path + texturesrc;
        if (gl["skybox-program"]) {
            this.program = gl["skybox-program"];
          }
          else {
            this.program = CG.Shader.createProgram(
              gl, 
              CG.Shader.createShader(gl, gl.VERTEX_SHADER, document.getElementById("skybox-vertex-shader").text), 
              CG.Shader.createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("skybox-fragment-shader").text)
            );
          }
          
          this.a_position = gl.getAttribLocation(this.program, "a_position");
          this.a_texcoord = gl.getAttribLocation(this.program, "a_texcoord");
          this.u_PVM_matrix = gl.getUniformLocation(this.program, "u_PVM_matrix");

          let texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
          let image = new Image();
          image.addEventListener("load", function(evt) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
          });
          image.src = texturesrc;

          this.texture = texture;
          
          let vertices = this.getVertices();

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.getFaces()), gl.STATIC_DRAW);

        let uv = this.getSmoothUV();
        this.uvSmoothBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvSmoothBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
        
        this.numfaces = this.getFaces().length;
        }
    
        getVertices()
        {
            let pos = [];

            for(var j = 0; j < this.nsegments; j++)
            {    
                var factor = (j/(this.nsegments-1));
                //Obtener la altura de cada segmento de la esfera
                var y = Math.cos(factor * Math.PI);
                
                var h =  this.g_radius *  y;
                for(var i = 0; i < this.nlados; i++)
                {
                    let theta = (i/this.nlados) *(Math.PI * 2);
                    let x = Math.cos(theta) * this.g_radius * (Math.sin(Math.PI * factor));
                    let z = Math.sin(theta) * this.g_radius * Math.sin(Math.PI * factor);

                    pos.push(x);
                    pos.push(h);
                    pos.push(z);
                }
            }   
            return pos;
        }
    
          
        getSmoothUV()
        {
            let uv = [];
            for(let j = 0; j < this.nsegments; j++)
            {
                let y = j / (this.nsegments - 1);
                for(let i = 0; i < this.nlados; i++)
                {
                    let x = i / (this.nlados - 1);  
                    uv.push(1-x, y,);
                }
            }
            return uv;
        }

        getFaces()
    {
        let faces = [];
        
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
                faces.push(index, index2, index3);
                faces.push(index3, index2, index2 + this.nlados);
            }
        }
        return faces;
    }
    
    
    draw(gl, PVM) {
        gl.useProgram(this.program);
        
        let transform = CG.Matrix4.multiply(PVM, this.initial_transform);    
        gl.uniformMatrix4fv(this.u_PVM_matrix, false, transform.toArray());

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    
        // el buffer de posiciones
        gl.enableVertexAttribArray(this.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

        //coordenadas de textura
        gl.enableVertexAttribArray(this.a_texcoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvSmoothBuffer);
        gl.vertexAttribPointer(this.a_texcoord, 2, gl.FLOAT, false, 0,0);
    
    
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.numfaces, gl.UNSIGNED_SHORT, 0);
    }
}