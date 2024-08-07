# Proyecto Final
Proyecto Final de Graficación por Computadora

Por Ricardo Sánchez Pérez.

## Controles
WASD para mover la nave.
Espacio para disparar.
Presionar "1" para cambiar a la vista ortográfica.

## Desarrollo
Se creo un juego inspirado por Space Invaders. Para el desarrollo, se implemento una clase GameObject que cuenta con funcionalidad básica para objetos interactivos del juego y permite implementar comportamiento único para objetos que derivan de esta. GameObject permite crear un objeto con una malla y material/shaders especificos, y agrega los objetos a una lista en la escena para que puedan ser actualizados y dibujados en el bucle de juego. De esta clase se derivan objetos como el jugador y los enemigos, los cuales tienen su propia implementación de la funcion update() para tener comportamiento propio. La escena contiene los objetos del juego y varios eventos que facilitan acciones en el juego, como invocacion de particulas o destruccion de objetos de juego.

El juego en si contiene diez "olas" de enemigos que aparecen en tiempos especificos, y la velocidad con la que aparecen incrementa tras el primer ciclo de olas, pero solo una vez. Los ciclos se reinician, por lo que el juego acabará solo cuando el jugador se quede sin vidas.

## Errores
Ocasionalmente la nave no registra bien la entrada, causando que repentinamente se mueva mucho hacia un extremo.
El juego se congela por unos cuantos fotogramas al invocar muchos enemigos a la vez.
Cambiar de pestaña puede ocasionar que los objetos en el juego reaparezcan en posiciones incorrectas.

## Creditos
Skybox por u/SCP106 
Obtenido de Reddit: https://www.reddit.com/r/Ultrakill/comments/xysymo/milky_way_skybox_i_made_put_it_in_your/

Musica de fondo:
Super Monkey Ball 2 Monkey Shot Expert. Super Monkey Ball 2. Compuesto por Ryuji Iuchi.
Recuperado de Youtube: https://www.youtube.com/watch?v=Ey7YKwdFsHI

Efecto de sonido de pistola laser:
MATRIXXX a.k.a. Lil Mati
Obtenido de FreeSound.org: https://freesound.org/people/MATRIXXX_/sounds/523205/

Efecto de sonido de enemigo derrotado:
MATRIXXX a.k.a. Lil Mati
Obtenido de FreeSound.ord: https://freesound.org/people/MATRIXXX_/sounds/521105/

Textura "UV Grid" obtenido de Blender.

Las otras texturas y modelos/obj son de creacion propia.
