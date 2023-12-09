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
    constructor(tag, posicion, rotacion, mesh, scene, material)
    {
        this.material = (material || new CG.Material(scene.gl, "sample-shader"))
        this.tag = (tag || "");
        let time = new Date().getTime();
        
        //console.log(this.id);
        this.posicion = new CG.Vector3(0,0,0);
        this.posicion = (posicion || new CG.Vector3(0,0,0));

        this.rotacion = (rotacion || new CG.Vector3(0,0,0));
        this.scale = new CG.Vector3(1,1,1);

        this.mesh = mesh;
          
        while(scene.gameobjects[time.toString()])
        {
            time += 1;
        }
        this.id = time.toString();
        scene.gameobjects[this.id] = this;
    }
    /**Actualiza la geometria */
    updateGeometry()
    {
        this.mesh.setScale(this.scale.x, this.scale.y, this.scale.z);
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

    draw(gl, pvm)
    {
        this.material.draw(gl, pvm, this.mesh);
    }    

    hit()
    {

    }
}