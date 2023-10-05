/**
 * Practica 2 por Ricardo Sánchez Pérez
 */
var CG =  CG || {};

CG.Vector3 = class{
    /**
     * Constructor por parametros. Si no se especifica uno o varios valores, se evaluan a cero.
     * @param {Number} x Valor de x
     * @param {Number} y Valor de y
     * @param {Number} z Valor de z
     */
    constructor(x,y,z)
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
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Suma dos vectores
     * @param {Vector3} u Vector 1 a sumar
     * @param {Vector3} v Vector 2 a sumar
     * @returns Vector resultante de la suma
     */
    static add(u, v)
    {
        return new CG.Vector3(u.x + v.x, u.y + v.y, u.z + v.z);
    }

    /**
     * Devuelve un vector con los mismos valores
     * @returns Vector3 con los mismos valores.
     */
    clone()
    {
        return new CG.Vector3(this.x,this.y,this.z);
    }

    /**
     * Obtiene el producto cruz de dos vectores
     * @param {Vector3*} u Vector 1
     * @param {Vector3} v Vector 2
     * @returns Vector resultante del producto cruz.
     */
    static cross(u,v)
    {
        let tx = u.y*v.z - u.z * v.y;
        let ty = u.z * v.x - u.x * v.z;
        let tz = u.x * v.y - u.y * v.x;

        return new CG.Vector3(tx, ty, tz);
    }

    /**
     * Obtiene la distancia euclidiana entre dos vectores
     * @param {Vector3*} u Vector 1
     * @param {Vector3} v Vector 2
     * @returns Distancia entre ambos vectores
     */
    static distance(u,v)
    {
        return Math.sqrt(CG.Vector3.squaredDistance(u,v));
    }

    /**
     * Obtiene el producto punto de dos vectores
     * @param {Vector3} u Vector 1
     * @param {Vector3} v Vector 2
     * @returns Producto punto
     */
    static dot(u,v)
    {
        return u.x * v.x + u.y * v.y + u.z * v.z;
    }

    /**
     * Determina si dos vectores son suficientemente iguales
     * @param {Vector3} u Vector 1
     * @param {Vector3} v Vector 2
     * @returns Boolean
     */
    static equals(u,v)
    {
        return CG.Vector3.distance(u,v) <= 0.000001;
    }

    /**
     * Determina si dos vectores tienen los mismos valores exactos
     * @param {Vector3} u Vector 1
     * @param {Vector3} v Vector 2
     * @returns Boolean
     */
    static exactEquals(u,v)
    {
        return u.x == v.x && u.y == v.y && u.z == v.z;
    }

    /**
     * Regresa la normal de un vector
     * @returns Vector normalizado
     */
    normalize()
    {

        let dt = CG.Vector3.distance(this, new CG.Vector3(0,0,0));
        
        return new CG.Vector3(this.x / dt, this.y / dt, this.z / dt);
    }

    /**
     * Asigna nuevos valores al vector
     * @param {Number} x Valor para x
     * @param {Number} y Valor para y
     * @param {Number} z Valor para z
     */
    set(x,y,z)
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

        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Devuelve la distancia cuadrada entre dos vectores
     * @param {Vector3} u Vector 1
     * @param {Vector3} v Vector 2
     * @returns Distancia cuadrada
     */
    static squaredDistance(u,v)
    {
        let dx = v.x - u.x;
        let dy = v.y - u.y;
        let dz = v.z - u.z;

        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Asigna cero a cada componente del vector
     */
    zero()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}