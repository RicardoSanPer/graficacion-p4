var CG = CG || {};

CG.Skybox = class{
    constructor(renderer, initial_transform, texturesrc)
    {
        this.initial_transform = initial_transform || new CG.Matrix4();
        this.nlados = 16;
        this.nsegments = 16;
        this.g_radius = 1;
        let path = "resources/textures/";
        texturesrc = (texturesrc || "bg2.png");
        texturesrc = path + texturesrc;
        if (renderer.gl["skybox-program"]) {
            this.program = renderer.gl["skybox-program"];
          }
          else {
            this.program = renderer.createProgram(
              renderer.gl, 
              renderer.createShader(renderer.gl, renderer.gl.VERTEX_SHADER, document.getElementById("skybox-vertex-shader").text), 
              renderer.createShader(renderer.gl, renderer.gl.FRAGMENT_SHADER, document.getElementById("skybox-fragment-shader").text)
            );
          }
          
          this.a_position = renderer.gl.getAttribLocation(this.program, "a_position");
          this.a_texcoord = renderer.gl.getAttribLocation(this.program, "a_texcoord");
          this.u_PVM_matrix = renderer.gl.getUniformLocation(this.program, "u_PVM_matrix");

          let texture = renderer.gl.createTexture();
          renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, texture);
          renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, 1, 1, 0, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
          let image = new Image();
          image.addEventListener("load", function(evt) {
            renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, texture);
            renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, renderer.gl.RGBA,renderer.gl.UNSIGNED_BYTE, image);
            renderer.gl.generateMipmap(renderer.gl.TEXTURE_2D);
          });
          image.src = texturesrc;

          this.texture = texture;
          
          let vertices = this.getVertices();

        this.positionBuffer = renderer.gl.createBuffer();
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.positionBuffer);
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(vertices), renderer.gl.STATIC_DRAW);

        this.indexBuffer = renderer.gl.createBuffer();
        renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        renderer.gl.bufferData(renderer.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.getFaces()), renderer.gl.STATIC_DRAW);

        let uv = this.getSmoothUV();
        this.uvSmoothBuffer = renderer.gl.createBuffer();
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.uvSmoothBuffer);
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(uv), renderer.gl.STATIC_DRAW);
        
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