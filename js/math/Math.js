var CG =  CG || {};

CG.Math = class
{
    static lerp(a,b,delta)
    {
        return a + (delta * (b - a));
    }

    static normalize(vector)
    {
        let sum = 0;
        for(let i = 0; i <vector.length; i++)
        {
            sum += vector[i];
        }
        for(let i = 0; i <vector.length; i++)
        {
            vector[i] = vector[i]/sum;
        }
        return vector;
    }
}