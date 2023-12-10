var CG =  CG || {};
/**
 * Clase Material. Establece parametros básicos de las texturas como color, posicion, matrices, etc.
 */
CG.Material = class{

    constructor(gl, fragmentShaderfile, color)
    {
        this.color = (color || [1,0,0,1]);
        let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
        let vertexShader = CG.Shader.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

        let fragmentShaderSource = document.getElementById(fragmentShaderfile).text;
        let fragmentShader = CG.Shader.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        
        this.program = CG.Shader.createProgram(gl, vertexShader, fragmentShader);

        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.a_texcoord = gl.getAttribLocation(this.program, "a_texcoord");
        
        this.normalAttributeLocation = gl.getAttribLocation(this.program, "a_normal");
        this.u_PVM_matrix = gl.getUniformLocation(this.program, "u_PVM_matrix");
        this.u_VM_matrix = gl.getUniformLocation(this.program, "u_VM_matrix");
        this.u_color = gl.getUniformLocation(this.program, "u_color");

        
        this.lightUniformLocation = gl.getUniformLocation(this.program, "u_light_position");

        
        this.CamPosition = gl.getUniformLocation(this.program, "cameraPos");
    
    }

    setDrawParams(gl, camara)
    {}

    draw(gl, camara, light, mesh)
    {
        gl.useProgram(this.program);
        
        let transform = CG.Matrix4.multiply(mesh.initial_transform, mesh.transformMatrix);

        let lightpos = camara.viewMatrix.multiplyVector(light);
        gl.uniform3f(this.lightUniformLocation, lightpos.x, lightpos.y, lightpos.z);

        // VM_matrixLocation
        let viewModelMatrix = CG.Matrix4.multiply(camara.viewMatrix, transform);
        gl.uniformMatrix4fv(this.u_VM_matrix, false, viewModelMatrix.toArray());
  
        // PVM_matrixLocation
        let projectionViewModelMatrix = CG.Matrix4.multiply(camara.projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(this.u_PVM_matrix, false, projectionViewModelMatrix.toArray());
    
        
        gl.uniform3f(this.CamPosition, camara.position.x, camara.position.y, camara.position.z);
        
        
        gl.uniform4f(this.u_color, this.color[0], this.color[1], this.color[2], this.color[3]);

        this.setDrawParams(gl, camara);
        
        if(mesh.hasFlat)
        {
            this.drawFlat(gl, mesh);
        }

        if(mesh.hasSmooth)
        {
            this.drawSmooth(gl, mesh);
        }
    }

    //Dibujar geometria suave
    drawSmooth(gl, mesh)
    {
        // el buffer de posiciones
        gl.enableVertexAttribArray(this.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
        gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

        //coordenadas de textura
        gl.enableVertexAttribArray(this.a_texcoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvSmoothBuffer);
        gl.vertexAttribPointer(this.a_texcoord, 2, gl.FLOAT, false, 0,0);

        // el buffer de normales
        gl.enableVertexAttribArray(this.normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.vertexAttribPointer(this.normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, mesh.numfaces, gl.UNSIGNED_SHORT, 0);
    }
    //Dibujar geometria plana
    drawFlat(gl, mesh)
    {
        // el buffer de posiciones
        gl.enableVertexAttribArray(this.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionFlatBuffer);
        gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0)

  
        // el buffer de normales
        gl.enableVertexAttribArray(this.normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalFlatBuffer);
        gl.vertexAttribPointer(this.normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        //coordenadas de textura
        gl.enableVertexAttribArray(this.a_texcoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvFlatBuffer);
        gl.vertexAttribPointer(this.a_texcoord, 2, gl.FLOAT, false, 0,0);

        
        gl.drawArrays(gl.TRIANGLES, 0, mesh.num_elements);
    }
}