var CG = CG || {};

CG.Renderer = class
{
    constructor()
    {
        this.canvas = document.getElementById("the_canvas");
        this.gl = this.canvas.getContext("webgl");
        if(!this.gl)
        {
            throw "WebGL no soportado";
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
        this.ambientColorLocation = this.gl.getUniformLocation(this.program, "ambientColor");
        this.CamPosition = this.gl.getUniformLocation(this.program, "cameraPos");

        this.texcoordLocation = this.gl.getAttribLocation(this.program, "a_texcoord");

        this.textureLocation = this.gl.getUniformLocation(this.program, "u_texture");
        this.normalTextureLocation = this.gl.getUniformLocation(this.program, "u_normalmap");
        this.specularTextureLocation = this.gl.getUniformLocation(this.program, "u_specularmap");

        this.ambientColor = new CG.Vector3(135/255, 206/255, 235/255);

        this.geometry = [
            new CG.Cilindro(
            this.gl, 
            [1, 0, 0, 1], 
            2, 2, 16, 0, 
            CG.Matrix4.translate(new CG.Vector3(-5, 0, -5)),
            "metal.jpg", "metal_normal.jpg", "metal_specular.jpg"
            ),
            new CG.Cono(
            this.gl, 
            [0, 1, 0, 1], 
            2, 2, 16, 16, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, -5)),
            "gravel.jpg", "gravel_normal2.jpg", "gravel_specular.jpg"
            ),
            new CG.Dodecaedro(
            this.gl, 
            [0, 0, 1, 1], 
            2, 
            CG.Matrix4.translate(new CG.Vector3(5, 0, -5)),
            ),
            new CG.Esfera(
            this.gl, 
            [0, 1, 1, 1], 
            2, 32, 16, 
            CG.Matrix4.translate(new CG.Vector3(-5, 0, 0)),
            "earth.jpg","earth_normal2.jpg","earth_specular.jpg"
            ),
            new CG.Icosaedro(
            this.gl, 
            [1, 0 , 1, 1], 
            2, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 0)),
            "d20.jpg"
            ),
            new CG.Octaedro(
            this.gl, 
            [1, 1, 0, 1], 
            2, 
            CG.Matrix4.translate(new CG.Vector3(5, 0, 0)),
            "sandstone.jpg", "sandstone_normal.jpg", "sandstone_specular.jpg"
            ),
            //6
            new CG.PrismaRectangular(
            this.gl, 
            [1, 0.2, 0.3, 1], 
            3, 3, 3, 
            CG.Matrix4.translate(new CG.Vector3(-5, 0, 5)),
            "brick.jpg", "brick_normal.jpg", "brick_specular.jpg"
            ),
            new CG.Tetraedro(
            this.gl, 
            [0.5, 0.5, 0.5, 1], 
            2, 
            CG.Matrix4.translate(new CG.Vector3(0, 0, 5)),
            "wall.jpg", "wall_normal.jpg", "wall_specular.jpg"
            ),
            new CG.Toro(
            this.gl, 
            [0.25, 0.25, 0.25, 1], 
            4, 1, 32, 16, 
            CG.Matrix4.translate(new CG.Vector3(5, 0, 5)),
            "bark.jpg", "bark_normal.jpg", "bark_specular.jpg"
            ),
        ];

        this.camara = new CG.CamaraCOI(this.canvas, new CG.Vector3(0,0,0));
        this.lightDir = new CG.LuzDireccional();
    }
    
    
//Dibuja la escena
draw()
{
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(this.ambientColor.x,this.ambientColor.y,this.ambientColor.z, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.useProgram(this.program);

    this.camara.updateMatrix();
    let cameraPos = this.camara.position;

    let lightpos = this.camara.viewMatrix.multiplyVector(this.lightDir.position);
    
    this.gl.uniform3f(this.lightUniformLocation, lightpos.x, lightpos.y, lightpos.z);
    this.gl.uniform3f(this.ambientColorLocation, this.ambientColor.x,this.ambientColor.y,this.ambientColor.z)
    this.gl.uniform3f(this.CamPosition, cameraPos.x, cameraPos.y, cameraPos.z);

    this.gl.uniform1i(this.textureLocation, 0);
    this.gl.uniform1i(this.normalTextureLocation, 1);
    this.gl.uniform1i(this.specularTextureLocation, 2);

    for (let i=0; i<this.geometry.length; i++) {
        // se dibuja la geometría
        this.geometry[i].draw(
          this.gl,
          this.positionAttributeLocation,
          this.normalAttributeLocation, 
          this.colorUniformLocation,
          this.PVM_matrixLocation,
          this.VM_matrixLocation,
          this.camara.projectionMatrix,
          this.camara.viewMatrix,
          this.texcoordLocation);
        }
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