var CG =  CG || {};

CG.Esfera = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color de la esfera (RGBA)
     * @param {Number} radius radio de la esfera
     * @param {Number} nfaces Numero de segmentos horizontales de la esfera
     * @param {Number} nsegments Numero de subdivisiones a lo largo de la altura
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, radius, nfaces, nsegments, initial_transform, texture, normal, specular)
    {
        super(initial_transform);
        this.g_radius  = (radius || 1);
        //Establecer como minimo 3 caras
        this.nlados = (nfaces || 10);
        this.nlados = (this.nlados < 3)? 3 : this.nlados;
        //Establecer como segmentos minimo 1
        this.nsegments = (nsegments || 1);
        this.nsegments = (this.nsegments < 1)? 1 : this.nsegments;
        this.nsegments += 2;

        this.initial_transform = initial_transform || new CG.Matrix4();
        this.color = color;
        
        this.setSmoothBuffer(gl);

    }
    /**Computa la posicion de los vertices */
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

    getFlatVertices()
    {
        let pos = this.getVertices();
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

    getSmoothNormals(vertices)
    {
        let normals = []
        let v1 = new CG.Vector3();
        for (let i=0; i<vertices.length; i+=3) {
            v1.set( vertices[i  ], vertices[i+1], vertices[i+2] );
            v1 = v1.normalize();
            normals.push(
              v1.x, v1.y, v1.z,
            );
          }
        return normals;
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
}
