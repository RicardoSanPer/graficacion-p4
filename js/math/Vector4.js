var CG =  CG || {};

CG.Vector4 = class
{
    /**
     * Constructor. Si falta algun parametro lo establece a 0
     * @param {Number} x Valor de x
     * @param {Number} y Valor de y
     * @param {Number} z Valor de z
     * @param {Number} w Valor de la coordenada homogenea
     */
    constructor(x,y,z,w)
    {
        if(x == undefined)
        {
            x = 0;
        }
        if(y == undefined)
        {
            y = 0;
        }
        if(z == undefined)
        {
            z = 0;
        }
        if(w == undefined)
        {
            w = 0;
        }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Regresa la suma de dos vectores
     * @param {Vector4} u Vector 1
     * @param {Vector4} v Vector 2
     * @returns Vector4 resultante
     */
    static add(u, v)
    {
        return new CG.Vector4(u.x + v.x, u.y + v.y, u.z + v.z, u.w + v.w);
    }

    /**
     * Crea una copia del vector con los mismos valores de coordenadas
     * @returns Vector4 con los mismos valores
     */
    clone()
    {
        return new CG.Vector4(this.x,this.y,this.z, this.w);
    }

    /**
     * Distancia euclidiana entre dos vectores
     * @param {Vector4} u Vector 1
     * @param {Vector4} v Vector 2
     * @returns Distancia euclidiana
     */
    static distance(u,v)
    {
        return Math.sqrt(CG.Vector4.squaredDistance(u,v));
    }

    /**
     * Obtiene la distancia cuadrada entre dos vectores
     * @param {Vector4} u Vector 1
     * @param {Vector4} v Vector 2
     * @returns Distancia cuadrada
     */
    static squaredDistance(u,v)
    {
        let dx = v.x - u.x;
        let dy = v.y - u.y;
        let dz = v.z - u.z;
        let dw = v.w - u.w;

        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    /**
     * Obtiene el producto punto de dos vectores
     * @param {Vector4} u Vector 1
     * @param {Vector4} v Vector 2
     * @returns Producto punto
     */
    static dot(u,v)
    {
        return u.x * v.x + u.y * v.y + u.z * v.z + u.w * v.w;
    }

    /**
     * Determina si dos vectores son iguales si son suficientemente iguales
     * @param {Vector4} u Vector 1
     * @param {Vector4} v Vector 2
     * @returns Boolean indicando su igualdad
     */
    static equals(u,v)
    {
        return CG.Vector4.distance(u,v) <= 0.000001;
    }

    /**
     * Determina si dos vectores tienen exactamente los mismos valores de coordenadas
     * @param {Vector4} u Vector 1
     * @param {Vector4} v Vector 2
     * @returns Boolean indicando su igualdad
     */
    static exactEquals(u,v)
    {
        return u.x == v.x && u.y == v.y && u.z == v.z && u.w == v.w;
    }

    /**
     * Obtiene el vector normalizado
     * @returns Copia del Vector4 normalizado
     */
    normalize()
    {

        let dt = CG.Vector4.distance(this, new CG.Vector4(0,0,0,0));
        
        return new CG.Vector4(this.x / dt, this.y / dt, this.z / dt, this.w / dt);
    }

    /**
     * Asigna nuevos valores al vector
     * @param {Number} x Valor para x
     * @param {Number} y Valor para y
     * @param {Number} z Valor para z
     * @param {Number} w Valor para w
     */
    set(x,y,z,w)
    {
        if(x == undefined)
        {
            x = this.x;
        }
        if(y == undefined)
        {
            y = this.y;
        }
        if(z == undefined)
        {
            z = this.z;
        }
        if(w == undefined)
        {
            w =this.w;
        }

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Asigna cero a cada componente del vector
     */
    zero()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }

    /**
     * Obtiene los valores del vector
     * @returns Array con los valores [x,y,z,w]
     */
    getValues()
    {
        return [this.x, this.y, this.z, this.w];
    }
}