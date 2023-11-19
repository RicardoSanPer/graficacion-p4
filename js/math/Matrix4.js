var CG =  CG || {};

CG.Matrix4 = class
{
    /**
     * Constructor por parametros
     * @param {Number} a00 
     * @param {Number} a01 
     * @param {Number} a02 
     * @param {Number} a03 
     * @param {Number} a10 
     * @param {Number} a11 
     * @param {Number} a12 
     * @param {Number} a13 
     * @param {Number} a20 
     * @param {Number} a21 
     * @param {Number} a22 
     * @param {Number} a23 
     * @param {Number} a30 
     * @param {Number} a31 
     * @param {Number} a32 
     * @param {Number} a33 
     */
    constructor(a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                a30, a31, a32, a33)
                {
                    if(
                        a00 == undefined || a01 == undefined || a02 == undefined || a03== undefined ||
                        a10 == undefined || a11 == undefined || a12 == undefined || a13== undefined ||
                        a20 == undefined || a21 == undefined || a22 == undefined || a23== undefined ||
                        a30 == undefined || a31 == undefined || a32 == undefined || a33== undefined 
                    )
                    {
                        this.identity();
                    }
                    else
                    {
                        this.set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33);
                    }
    }

    /**
     * Obtiene la suma de dos matrices
     * @param {Matrix4} m1 Matriz 1
     * @param {Matrix4} m2 Matriz 2
     * @returns Matriz suma resultante
     */
    static add(m1, m2)
    {
        return new CG.Matrix4(
            m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02, m1.a03 + m2.a03,
            m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12, m1.a13 + m2.a13,
            m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22, m1.a23 + m2.a23,
            m1.a30 + m2.a30, m1.a31 + m2.a31, m1.a32 + m2.a32, m1.a33 + m2.a33
        )
    }

    /**
     * Obitene la matriz adjunta
     * @returns Matrix4 adjunta
     */
    adjoint()
    {
        //Primera fila
        let c00 = new CG.Matrix3(this.a11, this.a12, this.a13,
                                this.a21, this.a22, this.a23,
                                this.a31, this.a32, this.a33,).determinant();
        let c01 = new CG.Matrix3(this.a10, this.a12, this.a13,
                                this.a20, this.a22, this.a23,
                                this.a30, this.a32, this.a33,).determinant();
        let c02 = new CG.Matrix3(this.a10, this.a11, this.a13,
                                this.a20, this.a21, this.a23,
                                this.a30, this.a31, this.a33,).determinant();
        let c03 = new CG.Matrix3(this.a10, this.a11, this.a12,
                                this.a20, this.a21, this.a22,
                                this.a30, this.a31, this.a32,).determinant();
        //Segunda fila
        let c10 = new CG.Matrix3(this.a01, this.a02, this.a03,
                                this.a21, this.a22, this.a23,
                                this.a31, this.a32, this.a33,).determinant();
        let c11 = new CG.Matrix3(this.a00, this.a02, this.a03,
                                this.a20, this.a22, this.a23,
                                this.a30, this.a32, this.a33,).determinant();
        let c12 = new CG.Matrix3(this.a00, this.a01, this.a03,
                                this.a20, this.a21, this.a23,
                                this.a30, this.a31, this.a33,).determinant();
        let c13 = new CG.Matrix3(this.a00, this.a01, this.a02,
                                this.a20, this.a21, this.a22,
                                this.a30, this.a31, this.a32,).determinant();
        //Tercera fila
        let c20 = new CG.Matrix3(this.a01, this.a02, this.a03,
                                this.a11, this.a12, this.a13,
                                this.a31, this.a32, this.a33,).determinant();
        let c21 = new CG.Matrix3(this.a00, this.a02, this.a03,
                                this.a10, this.a12, this.a13,
                                this.a30, this.a32, this.a33,).determinant();
        let c22 = new CG.Matrix3(this.a00, this.a01, this.a03,
                                this.a10, this.a11, this.a13,
                                this.a30, this.a31, this.a33,).determinant();
        let c23 = new CG.Matrix3(this.a00, this.a01, this.a02,
                                this.a10, this.a11, this.a12,
                                this.a30, this.a31, this.a32,).determinant();
        //Cuarta fila
        let c30 = new CG.Matrix3(this.a01, this.a02, this.a03,
                                this.a11, this.a12, this.a13,
                                this.a21, this.a22, this.a23,).determinant();
        let c31 = new CG.Matrix3(this.a00, this.a02, this.a03,
                                this.a10, this.a12, this.a13,
                                this.a20, this.a22, this.a23,).determinant();
        let c32 = new CG.Matrix3(this.a00, this.a01, this.a03,
                                this.a10, this.a11, this.a13,
                                this.a20, this.a21, this.a23,).determinant();
        let c33 = new CG.Matrix3(this.a00, this.a01, this.a02,
                                this.a10, this.a11, this.a12,
                                this.a20, this.a21, this.a22,).determinant();
        
        // Matriz de Coerficientes
        var coeficientes = new CG.Matrix4(c00,-1 * c01,c02,-1 * c03, 
                                        -1 * c10, c11, -1 * c12, c13, 
                                        c20, -1 * c21, c22, -1 * c23, 
                                        -1 * c30, c31, -1 * c32, c33);
        return coeficientes.transpose();
    }

    /**
     * Crea una copia de la matriz
     * @returns Copia de la matriz
     */
    clone()
    {
        return new CG.Matrix4(this.a00, this.a01, this.a02, this.a03,
                                this.a10, this.a11, this.a12, this.a13,
                                this.a20, this.a21, this.a22, this.a23,
                                this.a30, this.a31, this.a32, this.a33,)
    }

    /**
     * Determina si dos matrices son lo suficientemente iguales
     * @param {Matrix4} m1 Matriz 1
     * @param {Matrix4} m2 Matriz 2
     * @returns Boolean indicando si son lo suficientemente iguales.
     */
    static equals(m1, m2)
    {
        var resultado = true;
        resultado = resultado && Math.abs(m1.a00 - m2.a00) < 0.000001;
        resultado = resultado && Math.abs(m1.a01 - m2.a01) < 0.000001;
        resultado = resultado && Math.abs(m1.a02 - m2.a02) < 0.000001;
        resultado = resultado && Math.abs(m1.a03 - m2.a03) < 0.000001;

        resultado = resultado && Math.abs(m1.a10 - m2.a10) < 0.000001;
        resultado = resultado && Math.abs(m1.a11 - m2.a11) < 0.000001;
        resultado = resultado && Math.abs(m1.a12 - m2.a12) < 0.000001;
        resultado = resultado && Math.abs(m1.a13 - m2.a13) < 0.000001;

        resultado = resultado && Math.abs(m1.a20 - m2.a20) < 0.000001;
        resultado = resultado && Math.abs(m1.a21 - m2.a21) < 0.000001;
        resultado = resultado && Math.abs(m1.a22 - m2.a22) < 0.000001;
        resultado = resultado && Math.abs(m1.a23 - m2.a23) < 0.000001;

        resultado = resultado && Math.abs(m1.a30 - m2.a30) < 0.000001;
        resultado = resultado && Math.abs(m1.a31 - m2.a31) < 0.000001;
        resultado = resultado && Math.abs(m1.a32 - m2.a32) < 0.000001;
        resultado = resultado && Math.abs(m1.a33 - m2.a33) < 0.000001;

        return resultado;
    }

    /**
     * Determina si dos matrices son exactamente iguales
     * @param {Matrix4} m1 Matriz 1
     * @param {Matrix4} m2 Matriz 2
     * @returns Boolean determinando si son exactamente iguales
     */
    static exactEquals(m1, m2)
    {
        var resultado = true;
        resultado = resultado && m1.a00 == m2.a00;
        resultado = resultado && m1.a01 == m2.a01;
        resultado = resultado && m1.a02 == m2.a02;
        resultado = resultado && m1.a03 == m2.a03;

        resultado = resultado && m1.a10 == m2.a10;
        resultado = resultado && m1.a11 == m2.a11;
        resultado = resultado && m1.a12 == m2.a12;
        resultado = resultado && m1.a13 == m2.a13;

        resultado = resultado && m1.a20 == m2.a20;
        resultado = resultado && m1.a21 == m2.a21;
        resultado = resultado && m1.a22 == m2.a22;
        resultado = resultado && m1.a23 == m2.a23;

        resultado = resultado && m1.a30 == m2.a30;
        resultado = resultado && m1.a31 == m2.a31;
        resultado = resultado && m1.a32 == m2.a32;
        resultado = resultado && m1.a33 == m2.a33;

        return resultado;
    }

    /**
     * Obtiene la matriz de transformación del frustm
     * @param {Number} left Posicion del plano izquierdo
     * @param {Number} right Posicion del plano derecho
     * @param {Number} bottom Posicion del plano inferor
     * @param {Number} top Posicion del plano superior
     * @param {Number} near Posicion del plano cercano
     * @param {Number} far Posicion del plano lejano
     * @returns Matriz de transformacion
     */
    static frustum(left, right, bottom, top, near, far)
    {
        var c00 = (2*near)/(right - left);
        var c02 = (right + left)/(right - left);
        var c11 = (2*near)/(top - bottom);
        var c12 = (top + bottom)/(top - bottom);
        var c22 = -(far + near)/(far - near);
        var c23 = -2 * far * near / (far - near);

        return new CG.Matrix4(c00,0,c02,0,
                                0,c11,c12,0,
                                0,0,c22,c23,
                                0,0,1,0);
    }

    /**
     * Establece la matriz a la matriz identidad.
     */
    identity()
    {
        this.a00 = 1;
        this.a11 = 1;
        this.a22 = 1;
        this.a33 = 1;

        this.a01 = 0;
        this.a02 = 0;
        this.a03 = 0;

        this.a10 = 0;
        this.a12 = 0;
        this.a13 = 0;

        this.a20 = 0;
        this.a21 = 0;
        this.a23 = 0;

        this.a30 = 0;
        this.a31 = 0;
        this.a32 = 0;
    }

    /**
     * Obtiene la matriz inversa
     * @returns Matriz inversa
     */
    invert()
    {
        var adjunta = this.adjoint();
        var dt = this.determinant();

        return new CG.Matrix4.multiplyScalar(adjunta, (1/dt));
    }

    /**
     * Obtiene la matriz de mirada
     * @param {Vector3} eye Posicion de la camara
     * @param {Vector3} center Posicion del punto de enfoque
     * @param {Vector3} up Vector que indica la direccion hacia arriba
     * @returns Matriz de mirada
     */
    static lookAt(eye, center, up)
    {
        var forward = new CG.Vector3(eye.x - center.x, eye.y - center.y, eye.z - center.z);
        forward = forward.normalize();

        var right = CG.Vector3.cross(up, forward);
        right = right.normalize();

        var tempUp = CG.Vector3.cross(forward, right);
        tempUp = tempUp.normalize();

        var tx = CG.Vector3.dot(right, eye);
        var ty = CG.Vector3.dot(tempUp, eye);
        var tz = CG.Vector3.dot(forward, eye);

        return new CG.Matrix4(right.x, right.y, right.z, -tx,
                                tempUp.x, tempUp.y, tempUp.z, -ty,
                                forward.x, forward.y, forward.z, -tz,
                                0,0,0,1);
    }

    /**
     * Mutliplica dos matrices
     * @param {Matrix4} m1 Matriz 1
     * @param {Matrix4} m2 Matriz 2
     * @returns Matriz resultante de la multiplicacion
     */
    static multiply(m1,m2)
    {
        var a00 = m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20 + m1.a03 * m2.a30;
        var a01 = m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21 + m1.a03 * m2.a31;
        var a02 = m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22 + m1.a03 * m2.a32;
        var a03 = m1.a00 * m2.a03 + m1.a01 * m2.a13 + m1.a02 * m2.a23 + m1.a03 * m2.a33;

        var a10 = m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20 + m1.a13 * m2.a30;
        var a11 = m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21 + m1.a13 * m2.a31;
        var a12 = m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22 + m1.a13 * m2.a32;
        var a13 = m1.a10 * m2.a03 + m1.a11 * m2.a13 + m1.a12 * m2.a23 + m1.a13 * m2.a33;

        var a20 = m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20 + m1.a23 * m2.a30;
        var a21 = m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21 + m1.a23 * m2.a31;
        var a22 = m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22 + m1.a23 * m2.a32;
        var a23 = m1.a20 * m2.a03 + m1.a21 * m2.a13 + m1.a22 * m2.a23 + m1.a23 * m2.a33;

        var a30 = m1.a30 * m2.a00 + m1.a31 * m2.a10 + m1.a32 * m2.a20 + m1.a33 * m2.a30;
        var a31 = m1.a30 * m2.a01 + m1.a31 * m2.a11 + m1.a32 * m2.a21 + m1.a33 * m2.a31;
        var a32 = m1.a30 * m2.a02 + m1.a31 * m2.a12 + m1.a32 * m2.a22 + m1.a33 * m2.a32;
        var a33 = m1.a30 * m2.a03 + m1.a31 * m2.a13 + m1.a32 * m2.a23 + m1.a33 * m2.a33;

        return new CG.Matrix4(a00, a01, a02, a03,
                                a10, a11, a12, a13,
                                a20, a21, a22, a23,
                                a30, a31, a32, a33);
    }

    /**
     * Multiplica una matriz por un escalar
     * @param {Matrix4} m1 Matriz
     * @param {Number} c Escalar
     * @returns Matriz resultante del producto
     */
    static multiplyScalar(m1, c)
    {
        var a00 = m1.a00 * c;
        var a01 = m1.a01 * c;
        var a02 = m1.a02 * c;
        var a03 = m1.a03 * c;

        var a10 = m1.a10 * c;
        var a11 = m1.a11 * c;
        var a12 = m1.a12 * c;
        var a13 = m1.a13 * c;
        
        var a20 = m1.a20 * c;
        var a21 = m1.a21 * c;
        var a22 = m1.a22 * c;
        var a23 = m1.a23 * c;

        var a30 = m1.a30 * c;
        var a31 = m1.a31 * c;
        var a32 = m1.a32 * c;
        var a33 = m1.a33 * c;

        return new CG.Matrix4(a00, a01, a02, a03,
                                a10, a11, a12, a13,
                                a20, a21, a22, a23,
                                a30, a31, a32, a33);

    }

    /**
     * Multiplica un vector por la matriz
     * @param {Vector4} v Vector a multiplicar
     * @returns Vector multiplicado
     */
    multiplyVector(v)
    {
        let x = v.x * this.a00 + v.y * this.a01 + v.z * this.a02 + v.w * this.a03;
        let y = v.x * this.a10 + v.y * this.a11 + v.z * this.a12 + v.w * this.a13;
        let z = v.x * this.a20 + v.y * this.a21 + v.z * this.a22 + v.w * this.a23;
        let w = v.x * this.a30 + v.y * this.a31 + v.z * this.a32 + v.w * this.a33;

        return new CG.Vector4(x,y,z,w);
    }

    /**
     * Obtiene la matriz de proyeccion ortogonal
     * @param {Number} left 
     * @param {Number} right 
     * @param {Number} bottom 
     * @param {Number} top 
     * @param {Number} near 
     * @param {Number} far 
     * @returns 
     */
    static orthographic(left, right, bottom, top, near, far)
    {
        var c00 = 2 / (right - left);
        var c11 = 2 / (top - bottom);
        var c22 = -2/(near - far);

        var c03 = -(right + left)/(right-left);
        var c13 = -(top + bottom)/(top-bottom);
        var c23 = -(far + near)/(near-far);

        return new CG.Matrix4(c00,0,0,c03,
                                0,c11,0,c13,
                                0,0,c22,c23,
                                0,0,0,1);
    }

    /**
     * Obtiene la matriz de perspectiva usando campo de vision y
     * la relacion de aspecto
     * @param {Number} fovy Campo de vision
     * @param {Number} aspect Relacion de aspecto
     * @param {Number} near Plano cercano
     * @param {Number} far Plano lejano
     * @returns Matriz de transformacion
     */
    static perspective(fovy, aspect, near, far)
    {
        var c = 1 / Math.tan(fovy / 2);
        var c22 = -(far + near)/(far - near);
        var c23 = -2*near*far/(far - near);
        return new CG.Matrix4(c/aspect, 0,0,0,
                               0, c, 0, 0,
                               0, 0, c22, c23,
                               0,0,-1,0);
    }
    /**
     * Obtiene la determinante de la matriz
     * @returns Determinante
     */
    determinant()
    {
        let c00 = new CG.Matrix3(this.a11, this.a12, this.a13,
                                this.a21, this.a22, this.a23,
                                this.a31, this.a32, this.a33).determinant();
        let c01 = new CG.Matrix3(this.a10, this.a12, this.a13,
                                this.a20, this.a22, this.a23,
                                this.a30, this.a32, this.a33).determinant();
        let c02 = new CG.Matrix3(this.a10, this.a11, this.a13,
                                this.a20, this.a21, this.a23,
                                this.a30, this.a31, this.a33).determinant();
        let c03 = new CG.Matrix3(this.a10, this.a11, this.a12,
                                this.a20, this.a21, this.a22,
                                this.a30, this.a31, this.a32).determinant();

        return this.a00 * c00 - (this.a01 * c01) + this.a02 * c02 - (this.a03 * c03);
    }

    /**
     * Establece nuevos valores para la matriz
     * @param {Number} a00 
     * @param {Number} a01 
     * @param {Number} a02 
     * @param {Number} a03 
     * @param {Number} a10 
     * @param {Number} a11 
     * @param {Number} a12 
     * @param {Number} a13 
     * @param {Number} a20 
     * @param {Number} a21 
     * @param {Number} a22 
     * @param {Number} a23 
     * @param {Number} a30 
     * @param {Number} a31 
     * @param {Number} a32 
     * @param {Number} a33 
     */
    set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33)
    {
        this.a00 = a00;
        this.a01 = a01;
        this.a02 = a02;
        this.a03 = a03;

        this.a10 = a10;
        this.a11 = a11;
        this.a12 = a12;
        this.a13 = a13;

        this.a20 = a20;
        this.a21 = a21;
        this.a22 = a22;
        this.a23 = a23;

        this.a30 = a30;
        this.a31 = a31;
        this.a32 = a32;
        this.a33 = a33;
    }
    /**
     * Obtiene la matriz traspuesta
     * @returns Matrix4 traspuesta
     */
    transpose()
    {
        return new CG.Matrix4(this.a00, this.a10, this.a20, this.a30,
                              this.a01, this.a11, this.a21, this.a31,
                              this.a02, this.a12, this.a22, this.a32,
                              this.a03, this.a13, this.a23, this.a33);
    }

    /**
     * Obtiene la matriz de rotacion respecto al eje x
     * @param {Number} theta Angulo de rotacion
     * @returns Matriz de rotacion
     */
    static rotateX(theta)
    {
        return new CG.Matrix4(1,0,0,0,
                                0, Math.cos(theta), -Math.sin(theta), 0,
                                0, Math.sin(theta), Math.cos(theta),0,
                                0,0,0,1);
    }

    /**
     * Obtiene la matriz de rotacion respecto al eje y
     * @param {Number} theta Angulo de rotacion
     * @returns Matriz de rotacion
     */
    static rotateY(theta)
    {
        return new CG.Matrix4(Math.cos(theta), 0, Math.sin(theta),0,
                            0,1,0,0,
                            -Math.sin(theta),0,Math.cos(theta),0,
                            0,0,0,1);
    }
    /**
     * Obtiene la matriz de rotacion respecto al eje z
     * @param {Number} theta Angulo de rotacion
     * @returns Matriz de rotacion
     */
    static rotateZ(theta)
    {
        return new CG.Matrix4(Math.cos(theta), -Math.sin(theta),0,0,
                                Math.sin(theta), Math.cos(theta),0,0,
                                0,0,1,0,
                                0,0,0,1);
    }

    /**
     * Obtiene una matriz de escala
     * @param {Vector3} v Vector de escala
     * @returns Matriz de escala
     */
    static scale(v)
    {
        return new CG.Matrix4(v.x,0,0,0,
                                0,v.y,0,0,
                                0,0,v.z,0,
                                0,0,0,1);
    }

    /**
     * Obtiene una matriz de traslacion
     * @param {Vector3} v Vector de traslacion
     * @returns Matriz de traslacion
     */
    static translate(v)
    {
        return new CG.Matrix4(1,0,0,v.x,
                                0,1,0,v.y,
                                0,0,1,v.z,
                                0,0,0,1);
    }

    /**
     * Obtiene la subtracción de una matriz sobre otra
     * @param {Matrix4} m1 Matriz 1
     * @param {Matrix4} m2 Matriz 2
     * @returns Matriz resultante
     */
    static substract(m1, m2)
    {
        return new CG.Matrix4(
            m1.a00 - m2.a00, m1.a01 - m2.a01, m1.a02 - m2.a02, m1.a03 - m2.a03,
            m1.a10 - m2.a10, m1.a11 - m2.a11, m1.a12 - m2.a12, m1.a13 - m2.a13,
            m1.a20 - m2.a20, m1.a21 - m2.a21, m1.a22 - m2.a22, m1.a23 - m2.a23,
            m1.a30 - m2.a30, m1.a31 - m2.a31, m1.a32 - m2.a32, m1.a33 - m2.a33
        );
    }

    /**
     * Regresa la matriz como un array
     * @returns array con los elementos de la matriz
     */
    toArray()
    {
        return [this.a00, this.a10, this.a20, this.a30,
            this.a01, this.a11, this.a21, this.a31,
            this.a02, this.a12, this.a22, this.a32,
            this.a03, this.a13, this.a23, this.a33];
    }
}