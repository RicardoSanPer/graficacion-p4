class Main {

    constructor()
    {
        this.canvas = document.getElementById("the_canvas");
        this.gl = this.canvas.getContext("webgl");
        if(!this.gl)
        {
            return;
        }

        //Crear programa
        let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
        let vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);

        let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
        let fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.createProgram(this.gl, vertexShader, fragmentShader);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.normalAttributeLocation = this.gl.getAttribLocation(this.program, "a_normal");
        this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
        this.lightUniformLocation = this.gl.getUniformLocation(this.program, "u_light_position");
        this.PVM_matrixLocation = this.gl.getUniformLocation(this.program, "u_PVM_matrix");
        this.VM_matrixLocation = this.gl.getUniformLocation(this.program, "u_VM_matrix");
        this.CamPosition = this.gl.getUniformLocation(this.program, "cameraPos");
        this.specularUniform = this.gl.getUniformLocation(this.program, "useSpecular");
        
        this.posicionLuz = new CG.Vector4(0, 3, 0, 1);
        this.usarEspecular = false;

        this.prisma = new CG.PrismaRectangular(
            this.gl, 
            [1, 0.2, 0.3, 1], 
            1, 1, 1, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 0))
        );

        this.camara = new CG.Camara(this.canvas);

        this.update = this.draw.toString();
    }

    draw()
    {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.4, 0.4, 0.4, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.program);

        this.camara.updateCamera();
        this.camara.updateMatrix();
        let cameraPos = this.camara.position;

        let lightpos = this.camara.viewMatrix.multiplyVector(new CG.Vector4(0,2,0,1));
        this.gl.uniform3f(this.lightUniformLocation, lightpos.x, lightpos.y, lightpos.z);
        this.gl.uniform3f(this.CamPosition, cameraPos.x, cameraPos.y, cameraPos.z);
        this.gl.uniform1i(this.specularUniform, this.usarEspecular);

        this.prisma.draw(
            this.gl,
            this.positionAttributeLocation,
            this.normalAttributeLocation, 
            this.colorUniformLocation,
            this.PVM_matrixLocation,
            this.VM_matrixLocation,
            this.camara.projectionMatrix,
            this.camara.viewMatrix
        )
    }
    //////////////////////////////////////////////////////////
    // Funciones de utilería para la construcción de shaders
    //////////////////////////////////////////////////////////
    /**
     * Función que crear un shader, dado un contexto de render, un tipo y el código fuente
     */
    createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    
        if (success) {
        return shader;
        }
    
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    
    /**
     * Función que toma un shader de vértices con uno de fragmentos y construye un programa
     */
    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
    
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    
        if (success) {
        return program;
        }
    
        console.log(gl.getProgramInfoLog(program));
    }

}



var renderer = new Main();