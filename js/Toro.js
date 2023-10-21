var CG =  CG || {};

CG.Toro = class extends CG.Mesh{

    /** 
     * @param {*} gl Programa de WebGL
     * @param {Number} color Color del toro
     * @param {Number} diametroi diametro del toso
     * @param {Number} diametroe diametro del la circunferencia que dibuja el toro
     * @param {Number} nfaces numero de lados en la circunferencia
     * @param {Number} nsegments numero de circunferencias que formaran el toro
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, diametroi, diametroe, nfaces, nsegments, initial_transform)
    {
        super(color,initial_transform);
        this.diametroInterno  = (diametroi || 1)/2;
        this.diametroExterno = (diametroe || 1)/2;
        //Establecer como minimo 3 caras
        this.nlados = (nfaces || 10);
        this.nlados = (this.nlados < 3)? 3 : this.nlados;
        //Establecer como segmentos minimo 0
        this.nsegments = (nsegments || 10);
        this.nsegments = (this.nsegments < 0)? 3 : this.nsegments;

        this.setBuffers(gl);
    }

    /**Computa la posicion de los vertices */
    getVertices()
    {
        let pos = [];
        //Dibujar el toro
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

                pos.push(x);
                pos.push(y);
                pos.push(z);
            }
        }

        let faces = this.getFaces();
        let vertices = [];
        
        for (let i=0; i<faces.length; i++) {
            vertices.push(pos[faces[i]*3], pos[faces[i]*3 +1], pos[faces[i]*3 +2]);
        }
        return vertices;
    }

    /**Computa las caras */
    getFaces()
    {
        let faces = [];
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
                faces.push(index, index2, index3);
                faces.push(index3, index2, index2 + this.nlados);
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
            faces.push(index, index2, index3);
            faces.push(index3,  index2, (index2 + this.nlados) % this.nlados);
        }
        return faces;
    }

    getNormals(vertices) {
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
}