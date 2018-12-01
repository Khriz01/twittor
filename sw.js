//importar el archivo de las funciones para el sw
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//esta variable va contener todo lo que mi app necesita todo el contenido estatico
//Configuracion del service worker

//hay que verificar que ningun archivo este en la raiz, pero tenemos el problema de la pleca
const APP_SHELL = [
    //'/', //el slash sirve en desarrollo pero en produccion no
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js"
];


//instalacion del service worker
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE));
    let promesas = [cacheStatic, cacheInmutable];
    e.waitUntil(Promise.all(promesas));

});

//fin de instalacion

//proceso para que cada vez que se cambie el sw se borren los caches anteriores que ya no van a servir
self.addEventListener('activate', e => {


    //borrar los caches que sean diferentes a la version actual del cache
    self.addEventListener('activate', e => {

        //se necesita saber si existen otros caches con el nombre de static
        const respuesta = caches.keys().then(keys => {
            //aqui se obtienen todos los nombres que estan el localhost
            keys.forEach(key => { //aqui se van a barrer todos lo keys
                if (key !== STATIC_CACHE && key.includes('static')) {
                    return caches.delete(key);
                }
            });
        });
        e.waitUntil(respuesta); //hay que esperar que esto termine para no pasar al siguiente paso

    });

});


self.addEventListener('fetch', e => {

    //se tiene que verificar en el cache si existe el cache
    const respuesta = caches.match(e.request).then(res => {


        //si existe la peticion y la respuesta que retorne la respuesta
        if (res){
            return res;
        } else {

            //console.log(e.request.url);
            //se necesita hacer un fetch al recurso nuevo, ya que las librerias del fontaweson y las de google no estan disponibles
            return fetch(e.request).then(newRes => {

               return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

            });
        }

    });
    e.respondWith(respuesta);

});