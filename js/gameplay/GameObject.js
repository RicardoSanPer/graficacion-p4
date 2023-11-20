var CG =  CG || {};
/**
 * Clase gameobject para objetos de juego que tienen comportamiento dinamico
 */
CG.GameObject = class{
  /**
   * 
   * @param {Vector3} posicion 
   * @param {Vector3} rotacion 
   * @param {*} mesh 
   * @param {*} renderer 
   */
    constructor(posicion, rotacion, mesh, renderer)
    {
        this.id = new Date().getTime().toString();
        this.posicion = new CG.Vector3(0,0,0);
        this.posicion = (posicion || new CG.Vector3(0,0,0));

        this.rotacion = (rotacion || new CG.Vector3(0,0,0));

        this.mesh = mesh;
        
        if(renderer != null)
        {
          renderer.geometry[this.id] = this.mesh;
        }
    }
    /**Actualiza la geometria */
    updateGeometry()
    {
        this.mesh.setRotation(this.rotacion.x, this.rotacion.y, this.rotacion.z);
        this.mesh.setTranslation(this.posicion.x, this.posicion.y, this.posicion.z);
    }

    //Update
    update(delta)
    {

    }
    //Destruye el objeto
    destroy()
    {
      document.dispatchEvent(new CustomEvent("elementDeleted",{detail: {id: this.id,},}));
    }
}