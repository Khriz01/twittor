//este archivo es como una ayudado o un asistente del sw, ya que aqui se va trasladar un poco logica
//esta funcion se va encargar de guardar en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res){

    //si la respuesta la obtiene
    if(res.ok){
        //esta funcion retorna una promesa
        //entonces quiere decir que la respuesta tiene data y se tiene que almacenar en el cache
        return caches.open(dynamicCache).then(cache => {
            //primero almacenar en el cache la request
            cache.put(req, res.clone());
            return res.clone();
        });
    } else { //que pasa sino viene nada, aqui no se puede hacer nada porque ya fallo la red y tambien el cache
        //que regrese lo que sea que venga en la respuesta
        return res;
    }

}