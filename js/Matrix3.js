/**
 * Practica 2 por Ricardo Sánchez Pérez
 */
var CG =  CG || {};

CG.Matrix3 = class
{
    /**
     * Constructor. Si no hay parametros o falta alguno inicializa a la matriz identidad
     * @param {Number} a00 
     * @param {Number} a01 
     * @param {Number} a02 
     * @param {Number} a10 
     * @param {Number} a11 
     * @param {Number} a12 
     * @param {Number} a20 
     * @param {Number} a21 
     * @param {Number} a22 
     */
    constructor(a00, a01, a02, a10, a11, a12, a20, a21, a22)
    {
        if(
            a00 == undefined || a01 == undefined || a02 == undefined ||
            a10 == undefined || a11 == undefined || a12 == undefined ||
            a20 == undefined || a21 == undefined || a22 == undefined
        )
        {
            this.identity();
        }
        else
        {
            this.set(a00, a01, a02, a10, a11, a12, a20, a21, a22);
        }
    }

    /**
     * Devuelve la suma de dos matrices
     * @param {Matrix3} m1 Matriz 1
     * @param {Matrix3} m2 Matriz 2
     * @returns Matriz resultante de la suma
     */
    static add(m1, m2)
    {
        return new CG.Matrix3(
            m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02,
            m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12,
            m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22
        )
    }

    /**
     * Obtiene la matriz adjunta.
     * @returns Matriz adjunta
     */
    adjoint()
    {
        let a1 = this.a11 * this.a22 - this.a21 * this.a12;
        let a2 = -(this.a01 * this.a22 - this.a21 * this.a02);
        let a3 = this.a01 * this.a12 - this.a11 * this.a02;

        let a4 = -(this.a10 * this.a22 - this.a20 * this.a12);
        let a5 = this.a00 * this.a22 - this.a20 * this.a02;
        let a6 = -(this.a00 * this.a12 - this.a10 * this.a02);

        let a7 = this.a10 * this.a21 - this.a20 * this.a11;
        let a8 = -(this.a00 * this.a21 - this.a20 * this.a01);
        let a9 = this.a00 * this.a11 - this.a10 * this.a01;

        var cofactores = new CG.Matrix3(a1, a2, a3, a4, a5, a6, a7, a8, a9);
        return cofactores.transpose();
    }

    /**
     * Obtiene una matriz con los mismos valores
     * @returns Matriz con los mismos valores
     */
    clone()
    {
        return new CG.Matrix3(this.a00, this.a01, this.a02, 
                            this.a10, this.a11, this.a12, 
                            this.a20, this.a21, this.a22);
    }

    /**
     * Obtiene la determinante de la matriz
     * @returns Determinante
     */
    determinant()
    {
        return this.a00 * (this.a11 * this.a22 - this.a21 * this.a12) 
        - this.a01 * (this.a10 * this.a22 - this.a20 * this.a12)
        + this.a02 * (this.a10 * this.a21 - this.a20 * this.a11);
    }

    /**
     * Determina si los valores de dos matrices son suficientemente similares
     * @param {Matrix3} m1 Matriz 1
     * @param {Matrix3} m2 Matriz 2
     * @returns Boolean
     */
    static equals(m1, m2)
    {
        var resultado = true;
        resultado = resultado && Math.abs(m1.a00 - m2.a00) < 0.000001;
        resultado = resultado && Math.abs(m1.a01 - m2.a01) < 0.000001;
        resultado = resultado && Math.abs(m1.a02 - m2.a02) < 0.000001;

        resultado = resultado && Math.abs(m1.a10 - m2.a10) < 0.000001;
        resultado = resultado && Math.abs(m1.a11 - m2.a11) < 0.000001;
        resultado = resultado && Math.abs(m1.a12 - m2.a12) < 0.000001;

        resultado = resultado && Math.abs(m1.a20 - m2.a20) < 0.000001;
        resultado = resultado && Math.abs(m1.a21 - m2.a21) < 0.000001;
        resultado = resultado && Math.abs(m1.a22 - m2.a22) < 0.000001;

        return resultado;
    }

    /**
     * Determina si los valores de dos matrices son exactamente iguales.
     * @param {Matrix3} m1 Matriz 1
     * @param {Matrix3} m2 Matriz 2
     * @returns Boolean
     */
    static exactEquals(m1, m2)
    {
        var resultado = true;
        resultado = resultado && m1.a00 == m2.a00;
        resultado = resultado && m1.a01 == m2.a01;
        resultado = resultado && m1.a02 == m2.a02;

        resultado = resultado && m1.a10 == m2.a10;
        resultado = resultado && m1.a11 == m2.a11;
        resultado = resultado && m1.a12 == m2.a12;

        resultado = resultado && m1.a20 == m2.a20;
        resultado = resultado && m1.a21 == m2.a21;
        resultado = resultado && m1.a22 == m2.a22;

        return resultado;
    }

    /**
     * Convierte la matriz a la matriz identidad
     */
    identity()
    {
        this.a00 = 1;
        this.a11 = 1;
        this.a22 = 1;

        this.a01 = 0;
        this.a02 = 0;

        this.a10 = 0;
        this.a12 = 0;

        this.a20 = 0;
        this.a21 = 0;
    }

    /**
     * Obtiene la inversa de una matriz.
     * @returns Matriz inversa
     */
    invert()
    {
        var adjunta = this.adjoint();
        var determinante = this.determinant();

        return CG.Matrix3.multiplyScalar(adjunta, 1/determinante);
    }

    /**
     * Multiplica dos matrices
     * @param {Matrix3} m1 Matriz 1
     * @param {Matrix3} m2 Matriz 2
     * @returns Matriz
     */
    static multiply(m1, m2)
    {
        let r1 = m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20;
        let r2 = m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21;
        let r3 = m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22;

        let r4 = m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20;
        let r5 = m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21;
        let r6 = m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22;

        let r7 = m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20;
        let r8 = m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21;
        let r9 = m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22;

        return new CG.Matrix3(r1, r2, r3, r4, r5, r6, r7, r8, r9);
    }

    /**
     * Devuele la multipliacion escalar de una matriz
     * @param {Matrix} m1 Matriz
     * @param {Number} c Escalar
     * @returns Matriz multiplicada
     */
    static multiplyScalar(m1, c)
    {
        return new CG.Matrix3(m1.a00 * c, m1.a01 * c, m1.a02 * c, 
            m1.a10 * c, m1.a11 * c, m1.a12 * c, 
            m1.a20 * c, m1.a21 * c, m1.a22 * c);
    }

    /**
     * Multiplica un vector por una matriz
     * @param {Vector3} v Vector por multiplicar
     * @returns Vector multiplicado por la matriz
     */
    multiplyVector(v)
    {
        let x = v.x * this.a00 + v.y * this.a01 + v.z * this.a02;
        let y = v.x * this.a10 + v.y * this.a11 + v.z * this.a12;
        let z = v.x * this.a20 + v.y * this.a21 + v.z * this.a22;

        return new CG.Vector3(x,y,z);

    }

    /**
     * Devuelve una matriz de rotacion
     * @param {Number} theta Angulo de rotacion
     * @returns Matriz de rotacion
     */
    static rotate(theta)
    {
        return new CG.Matrix3(Math.cos(theta), -Math.sin(theta), 0, 
                                Math.sin(theta), Math.cos(theta), 
                                0, 0,0,1)
    }

    /**
     * Devuelve una matriz de escalamiento
     * @param {Number} sx Escala sobre x
     * @param {Number} sy Escala sobre y
     * @returns Matriz de escalamiento
     */
    static scale(sx, sy)
    {
        return new CG.Matrix3(sx, 0, 0, 0, sy, 0,0, 0, 1);
    }

    /**
     * Devuelve una matriz de traslacion
     * @param {Number} tx Traslacion en x
     * @param {Number} ty Traslacion en y
     * @returns 
     */
    static translate(tx, ty)
    {
        return new CG.Matrix3(1, 0, tx, 0, 1, ty, 0, 0, 1);
    }

    /**
     * Subtrae una matriz de otra
     * @param {Matrix3} m1 Matriz 1
     * @param {Matrix3} m2 Matriz 2
     * @returns Matriz substraida
     */
    static substract(m1, m2)
    {
        return new CG.Matrix3(
            m1.a00 - m2.a00, m1.a01 - m2.a01, m1.a02 - m2.a02,
            m1.a10 - m2.a10, m1.a11 - m2.a11, m1.a12 - m2.a12,
            m1.a20 - m2.a20, m1.a21 - m2.a21, m1.a22 - m2.a22
        )
    }
    /**
     * Regresa la traspuesta de una matriz
     * @returns Matriz traspuesta
     */
    transpose()
    {
        return new CG.Matrix3(this.a00, this.a10, this.a20, 
                            this.a01, this.a11, this.a21, 
                            this.a02, this.a12, this.a22);
    }

    /**
     * Assigna nuevos valores a la matriz
     * @param {Number} a00 
     * @param {Number} a01 
     * @param {Number} a02 
     * @param {Number} a10 
     * @param {Number} a11 
     * @param {Number} a12 
     * @param {Number} a20 
     * @param {Number} a21 
     * @param {Number} a22 
     */
    set(a00, a01, a02, a10, a11, a12, a20, a21, a22)
    {
        if(
            a00 == undefined || a01 == undefined || a02 == undefined ||
            a10 == undefined || a11 == undefined || a12 == undefined ||
            a20 == undefined || a21 == undefined || a22 == undefined
        )
        {
            this.a00 = 1;
            this.a11 = 1;
            this.a22 = 1;

            this.a01 = 0;
            this.a02 = 0;

            this.a10 = 0;
            this.a12 = 0;
            
            this.a20 = 0;
            this.a21 = 0;
        }
        else
        {
            this.a00 = a00;
            this.a01 = a01;
            this.a02 = a02;

            this.a10 = a10;
            this.a11 = a11;
            this.a12 = a12;

            this.a20 = a20;
            this.a21 = a21;
            this.a22 = a22;
        }
    }
}