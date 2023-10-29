var CG =  CG || {};

CG.Mesh = class{

    constructor(gl, color, initial_transform, texture, normal, specular) {
        
        this.color = color;
        this.initial_transform = initial_transform || new CG.Matrix4();

        this.translation = new CG.Vector3(0,0,0);
        this.rotation = new CG.Vector3(0,0,0);
        this.scaleV = new CG.Vector3(1,1,1);

        this.transformMatrix = new CG.Matrix4();

        let path = "resources/textures/";

        texture = (texture || "uvgrid.png");
        normal = (normal || "uvgrid.png");
        specular = (specular || "uvgrid.png");

        this.texture = this.loadTexture(path + texture, gl);
        this.normalTexture = this.loadTexture(path + normal, gl);
        this.specularTexture = this.loadTexture(path + specular, gl);
  
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
       * Dibuja la geometría con normales de vértice
       * @param {*} gl 
       * @param {*} positionAttributeLocation 
       * @param {*} normalAttributeLocation 
       */
      drawSmooth(gl, positionAttributeLocation, normalAttributeLocation,uvUniformLocation)
      {
        // el buffer de posiciones
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

  
        // el buffer de normales
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        //coordenadas de textura
        gl.enableVertexAttribArray(uvUniformLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvSmoothBuffer);
        gl.vertexAttribPointer(uvUniformLocation, 2, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.numfaces, gl.UNSIGNED_SHORT, 0);
        
      }

      /**
       * Dibuja la geometria con normales de cara
       * @param {*} gl 
       * @param {*} positionAttributeLocation 
       * @param {*} normalAttributeLocation 
       */
      drawFlat(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation)
      {
        // el buffer de posiciones
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionFlatBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

  
        // el buffer de normales
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalFlatBuffer);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        //coordenadas de textura
        gl.enableVertexAttribArray(uvUniformLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvFlatBuffer);
        gl.vertexAttribPointer(uvUniformLocation, 2, gl.FLOAT, false, 0,0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
      }

      /**
       * Dibuja la geometria
       * @param {*} gl 
       * @param {*} positionAttributeLocation 
       * @param {*} normalAttributeLocation 
       * @param {*} colorUniformLocation 
       * @param {*} PVM_matrixLocation 
       * @param {*} VM_matrixLocation 
       * @param {*} projectionMatrix 
       * @param {*} viewMatrix 
       * @param {*} uvUniformLocation 
       */
      draw(gl, positionAttributeLocation, normalAttributeLocation, colorUniformLocation, PVM_matrixLocation, VM_matrixLocation, projectionMatrix, viewMatrix, uvUniformLocation) 
      {
        // el color
        gl.uniform4fv(colorUniformLocation, this.color);

        
        let transform = CG.Matrix4.multiply(this.initial_transform, this.transformMatrix);
        // VM_matrixLocation
        let viewModelMatrix = CG.Matrix4.multiply(viewMatrix, transform);
        gl.uniformMatrix4fv(VM_matrixLocation, false, viewModelMatrix.toArray());
  
        // PVM_matrixLocation
        let projectionViewModelMatrix = CG.Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toArray());

        //texturas
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.normalTexture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.specularTexture);

        
        this.drawGeometry(gl, positionAttributeLocation, normalAttributeLocation,uvUniformLocation);
        
        // dibujado
      }

      /**
       * Dibuja la geometria
       * @param {*} gl 
       * @param {*} positionAttributeLocation 
       * @param {*} normalAttributeLocation 
       */
      drawGeometry(gl, positionAttributeLocation, normalAttributeLocation,uvUniformLocation)
      {

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