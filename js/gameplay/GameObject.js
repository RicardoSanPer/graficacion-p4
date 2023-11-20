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
    constructor(tag, posicion, rotacion, mesh, renderer)
    {
        this.tag = (tag || "");
        let time = new Date().getTime();
        
        //console.log(this.id);
        this.posicion = new CG.Vector3(0,0,0);
        this.posicion = (posicion || new CG.Vector3(0,0,0));

        this.rotacion = (rotacion || new CG.Vector3(0,0,0));

        this.mesh = mesh;
        
        if(renderer != null)
        {
          //Si el id ya existe, asignar nuevo para evitar errores de renderizado
          while(renderer.geometry[time.toString()])
          {
            time += 1;
          }
          this.id = time.toString();
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