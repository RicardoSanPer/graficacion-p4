var CG =  CG || {};

CG.Mesh = class{

    constructor(initial_transform) {
        
        this.color = [1,1,1,1];
        this.initial_transform = initial_transform || new CG.Matrix4();

        this.translation = new CG.Vector3(0,0,0);
        this.rotation = new CG.Vector3(0,0,0);
        this.scaleV = new CG.Vector3(1,1,1);

        this.transformMatrix = new CG.Matrix4();

        this.hasSmooth = false;
        this.hasFlat = false;
  
      }
      /**
       * Crea los buffers de geometria suavizada
       * @param {*} gl 
       */
      setSmoothBuffer(gl)
      {
        let vertices = this.getVertices();
        let normals = this.getSmoothNormals(vertices);
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // creación del buffer de normales del prisma
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.getFaces()), gl.STATIC_DRAW);

        let uv = this.getSmoothUV();
        this.uvSmoothBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvSmoothBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
        
        this.numfaces = this.getFaces().length;
        this.hasSmooth = true;
      }

      /**
       * Crea buffer de geometria plana
       * @param {*} gl 
       */
      setFlatBuffer(gl)
      {
        let vertices = this.getFlatVertices();
        let normals = this.getNormals(vertices);

        this.positionFlatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionFlatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.normalFlatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalFlatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        let uv = this.getFlatUV();
        this.uvFlatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvFlatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

        this.num_elements = vertices.length / 3;

        this.hasFlat = true;

      }
      /**
       * Carga una imagen
       * @param {String} src 
       * @param {*} gl 
       * @returns 
       */
      loadTexture(src, gl) {
        const texture = gl.createTexture();
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = src;
        return texture;
    }
      
      /**
       * Obtiene la lista de vértices para la geometria con drawElements (geometria con shading plano)
       * @returns 
       */
      getVertices()
      {
        return [];
      }

      getSmoothNormals(vertices)
      {
        return vertices;
      }
      /**
       * Obtiene la lista de vértices para la geometria con drawArray (geometria con shading suavizado)
       * @returns 
       */
      getFlatVertices()
      {
        return [];
      }

      /**
       * Obtiene la lista de indices de caras para la geometria con drawElements (geometria con shading suavizado)
       * @returns 
       */
      getFaces()
      {
        return [];
      }

      /**
       * Obtiene la lista de indices de caras para la geometria con drawElements (geometria con shading suavizado)
       * @returns 
       */
      getFlatFaces()
      {
        return [];
      }

      /**
       * Dada una lista de vértices, obtiene sus normales
       * @param {Vector3} vertices 
       * @returns 
       */
      getNormals(vertices)
      {
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

      /**
       * Genera las UVs de geometria plana
       * @returns array con las coordenadas uv
       */
      getFlatUV()
      {
        return [];
      }
      /**
       * Genera las UVs de la geometria suave
       * @returns array con las coordenadas uv
       */
      getSmoothUV()
      {
        return [];
      }

      /**
       * Establece una rotacion para el objeto
       * @param {Number} x 
       * @param {Number} y 
       * @param {Number} z 
       */
      setRotation(x,y,z)
      {
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.rotation.set(x,y,z);

        this.updateTransformMatrix();
      }
      /**
       * Establece una traslacion para el objeto
       * @param {Number} x 
       * @param {Number} y 
       * @param {Number} z 
       */
      setTranslation(x,y,z)
      {
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.translation.set(x,y,z);
        this.updateTransformMatrix();
      }
      /**
       * Establece una escala para el objeto
       * @param {Number} x 
       * @param {Number} y 
       * @param {Number} z 
       */
      setScale(x,y,z)
      {
        x = (x || 1);
        y = (y || 1);
        z = (z || 1);

        this.scaleV.set(x,y,z);
        this.updateTransformMatrix();
      }

      Rotate(x,y,z)
      {

        let conversion = Math.PI / 180;
        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.rotation.x += x * conversion;
        this.rotation.y += y * conversion;
        this.rotation.z += z * conversion;

        this.updateTransformMatrix();
      }

      Translate(x,y,z)
      {

        x = (x || 0);
        y = (y || 0);
        z = (z || 0);

        this.translation.x += x;
        this.translation.y += y;
        this.translation.z += z;

        this.updateTransformMatrix();
      }

      updateTransformMatrix()
      {
        this.transformMatrix = CG.Matrix4.scale(this.scaleV);
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.translate(this.translation));
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.rotateX(this.rotation.x));
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.rotateY(this.rotation.y));
        this.transformMatrix = CG.Matrix4.multiply(this.transformMatrix, CG.Matrix4.rotateZ(this.rotation.z));
      }
}