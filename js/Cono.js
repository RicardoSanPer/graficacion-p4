var CG =  CG || {};

/**
 * Cono es igual a cilindro, excepto que se "elimina" el segmento superior para
 * que el vértice central cumpla el rol de punta.
 */
CG.Cono = class extends CG.Mesh{

    /**
     * 
     * @param {*} gl Programa de Webgl
     * @param {Array} color Color del cono (RGBA)
     * @param {Number} diameter Diametro del cono
     * @param {Number} height Altura del cono
     * @param {Number} nfaces Numero de caras en el cono
     * @param {Number} nsegments Numero de subdivisiones a lo largo de la altura
     * @param {Matrix4} initial_transform Transformacion inicial
     */
    constructor(gl, color, diameter, height, nfaces, nsegments, initial_transform, texture, normal, specular)
    {
        super(color, initial_transform, texture, normal, specular);

        this.g_radius  = (diameter || 1);
        this.g_height = (height || 1);
        //Establecer como minimo 3 caras
        this.nlados = (nfaces || 10);
        this.nlados = (this.nlados < 3)? 3 : this.nlados;
        //Establecer como segmentos minimo 0
        this.nsegments = (nsegments || 0);
        this.nsegments = (this.nsegments < 0)? 0 : this.nsegments; 
        this.nsegments += 2;

        this.setSmoothBuffer(gl);
        this.setFlatBuffer(gl);
    }

    /**
     * Calcula la posicion de los vértices
     */
    getVertices()
    {
        var pos = [];

        //El cono esencialmente se crea igual que un cilindro, excepto que se
        // la punta es el ultimo segmento con escala 0
        for(var j = 0; j < this.nsegments; j++)
        {    
            //Obtener la altura de cada segmento del cilindro
            var desiredH = (this.g_height * 2);
            //Factor de la altura para escalar
            var factor = (j/(this.nsegments-1));
            var h =  desiredH * factor;
            for(var i = 0; i < this.nlados; i++)
            {
                let theta = (i/this.nlados) *(Math.PI * 2);
                let x = Math.cos(theta) * this.g_radius * (1 - factor);
                let y = Math.sin(theta) * this.g_radius * (1 - factor);

                pos.push(x);
                pos.push(-this.g_height + h);
                pos.push(y);
            }
        }
        
        return pos;
    }

    getFlatVertices()
    {
        var pos = [];
        
        pos.push(0);
        pos.push(-this.g_height);
        pos .push(0);

        for(var i = 0; i < this.nlados; i++)
            {
                let theta = (i/this.nlados) *(Math.PI * 2);
                let x = Math.cos(theta) * this.g_radius;
                let y = Math.sin(theta) * this.g_radius;

                pos.push(x);
                pos.push(-this.g_height);
                pos.push(y);
            }


        let faces = this.getFlatFaces();
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
        
         
        //Lados del cono
        for(var j = 0; j < this.nsegments - 1; j++)
        {
            var h = (j * this.nlados);
            for(var i = 0; i < this.nlados; i++)
            {
                let index = h + (i % this.nlados);
                let index2  = h + ((index + 1) % this.nlados);
                let index3 = index + this.nlados;
                //Dibujar ambos triangulos de la cara
                faces.push(index, index3, index2);
                faces.push(index3, index2 + this.nlados, index2);
            }
        }
        return faces;
    }

    getFlatFaces()
    {
        let faces = [];
        // Obtener circulo base    
        for(var i = 1; i < this.nlados; i++)
        {
            let index = i % this.nlados;
            let index2  = index + 1;
            faces.push(0, index, index2);
        }
        faces.push(0, this.nlados, 1);
        return faces;   
    }

    //TODO: Arreglar normales
    getSmoothNormals(vertices)
    {
        let normals = []
        let v1 = new CG.Vector3();
        let coneAngle = Math.atan(this.g_height / this.g_radius);
        for (let i=0; i<vertices.length; i+=3) {
            v1.set( vertices[i  ], Math.sin(coneAngle), vertices[i+2] );
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
                uv.push(1-x, 1 - y/2,);
            }
        }
        return uv;
    }

    getFlatUV()
    {
        let uv = [];
         
        for(var i = 0; i < this.nlados + 1; i++)
        {
            let theta = (i/this.nlados) *(Math.PI * 2);
            let theta2 = ((i+1)/this.nlados) *(Math.PI * 2);
            let x = Math.cos(theta) * -1;
            let y = Math.sin(theta);
            let centerx = 0.25;
            x = x / 4;
            y = y / 4;
            
            x += centerx;
            y += 0.25;

            uv.push(centerx, 0.25,
                x,y);

            x = Math.cos(theta2) * -1;
            y = Math.sin(theta2);

            x = x / 4;
            y = y / 4;
            
            x += centerx;
            y += 0.25;
            uv.push(x,y);
            
        }
        return uv
    }


    drawGeometry(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation)
    {
        this.drawSmooth(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation);
        this.drawFlat(gl, positionAttributeLocation, normalAttributeLocation, uvUniformLocation);
    }
}