/*console.log('hola')
console.log('API URL= https://fgdsgdsgdsfgds.com/dfsfsdf?api_key='+API_KEY)*/
//import { API_KEY } from "./secrets";



//creamos una instancia de axios
//DATA
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',// URL Base para solictude a las Apis
    headers: {
        'Content-Type': 'application/json;charset=utf-8',//formato de respuesta del servidor (json)
    },
    params: {
        'api_key': API_KEY,//Api_key (autorizacion)
    },
});

//FUNCION QUE RETORNA EL OBJETO DE PELICULA GUARDADAS EN LOCALSTORAGE COMO favoritas
function likedMoviesList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));//este item devuelve null si es la primera ves que entramos a la aplicacion y el usuario no ha seleccionado ninguna pelicula como favorita y convierte
    // lo que sea que devuelva localStorage a objeto
    let movies;
    if(item){// valido si item tiene algo
        movies = item; // alameceno ese algo en movies

    }else{
        movies = {}; // si item no tiene nada hago que movies sea igual a un objeto vacio
    }
    return movies;
}

//FUNCION QUE GUARDA O ELIMINA LA PELICULA SEGUN EL USUARIO DE CLCIK EN EL BOTON CORAZON LO CUAL SIGNIFICA QUE LE GUSTO LA PELICULA PARA GUARDARLA EN LA NUEVA SECCION DE FAVORITOS
function likeMovie(movie){
   //identificamos si vamos a guardar o a eliminar la pelicula en el localStorage    
    const likedMovies = likedMoviesList();// esta lista contiene las peliculas favoritas por el usuario
    if(likedMovies[movie.id]  ){//SI LA PLEICULA YA SE ENCUENTRA GUARDADA EN LOCALSTORAGE LE ELIMINAMOS
        //console.log("La pelicula ya se encontra guardada en el localStorage por lo tanto de debe eliminar")
        likedMovies[movie.id] = undefined;// eliminamos la pelicula

    }else{
        //SI LA PELICULA NO ESTA GUARDADA EN LOCALSTORAGE ENTONCES SE GUARDA LA PELICULA EN LOCALSTORAGE
        //console.log("La pelicula no se encontra guardada en el localStorage por lo tanto de debe guardar en el localStorage")
        likedMovies[movie.id] = movie;// guardo la pelicula con todas sus propiedades
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))//sin importar si entra al if o entra el else vamos a volver a guardar las peliculas para eso convertimos la pelicula objeto a pelicula string

}

//SIN AXIOS
/*async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key='+API_KEY);
    const data = await res.json();

    const movies = data.results;
    console.log({data, movies})
    movies.forEach(movie => {
       // console.log(movie)// imprimo cada uno de los objetos del array, es decir imprimo cada una de las movies
       //selecciono el elemento seccion que tiene id = trendingPreview y dentro de la seccion 
       //selecciono el elemento con la class="trendingPreview-movieList que corresponde al elemento articulo
       const trendingPreviewMoviesSection = document.querySelector('#trendingPreview .trendingPreview-movieList')
       const movieContainer = document.createElement('div');//creo el div que va a contener la imagen de la pelicula
       movieContainer.classList.add('movie-container')// le agrego al div la class="movie-container"

       const movieImage = document.createElement('img'); // creo la imagen que va estar dentro del div(movieContainer)
       movieImage.classList.add('movie-img') //le agrego a la img la class="movie-img"
       movieImage.setAttribute('alt', movie.title )// agrego el atributo (alt) con su valor a la (img)
       movieImage.setAttribute('src','https://image.tmdb.org/t/p/w300/'+ movie.poster_path)//agrego el atributo (src) con su valor
       
       movieContainer.appendChild(movieImage)//agergo la imagen al div
       //agrego el div que contiene la imagen de la pelicula al articulo que se ecuentra dentro de la seccion
       trendingPreviewMoviesSection.appendChild(movieContainer)
    })
}*/



//UTILS
//Observo todo el documento HTML para lo cual omito el parametro es decir el objeto de opciones
//al (IntersectionObserver) solo le pasamos como parametro el  (callback) omitiendo el parametro de opciones, ya que este lazyloader se va a utilizar para todas 
//las imagenes de todos los contenedores posibles.En el caso de que por cada contenedor de imagenes se quiera crear un lazyloader tambien se puede hacer pero tendria 
//que pasar el parametro de (options) al IntersectionObserver(callback, options)
//Los (enries) son cada uno de los elemntos HTML que el usuario esta observando dentro del ViewPort, es decir, son cada una de las imagenes
//--------------------------CREO EL OBSERVADOR (LAZYLOADER)----------------------------------------------------------
const lazyLoader = new IntersectionObserver((entries) => {//por cada uno de los elementos de estas (entries -> esto es un array de entries) Hagamos algo

    entries.forEach((entry) => { //Se sabe que el elemento entry va a tener la propiedad (data-img) con la url de la imagen de la pelicula a mostrar        
        if (entry.isIntersecting) {
            console.log({ entry }) // meto cada entry dentro de un objeto
            const url = entry.target.getAttribute('data-img')//capturamos la url del entry(elemento/imagen)
            entry.target.setAttribute('src', url);//insertamos la url en el entry(elemento/imagen)

        }

    });
});
//-------------------------------------------------------------------------------------------------------------------

//UTILS (Esta funcion es genericas o recursiva)
//FUNCION QUE CREA CADA UNA DE LAS PELICULAS DEL LISTADO DE PELICULAS Y LAS UBICA EN EL RESPECTIVO CONTENEDOR
//recibo como parametros el array de las 20 peliculas y el contenedor de donde se deden insertar() esas peliculas, ademas recibe el parametro (true o false)
//dependiendo si se quiere que se aplique (lazyLoading)
//function createMovies(movies, container)function createMovies(movies, container) {
//function createMovies(movies, container, lazyLoad = false) {
//function createMovies(movies, container, lazyLoad = false, clean = true) { // no es bueno pasar tanto parametro como valores true o false, es mejor pasarlo como un objeto
function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) { // despues de la tercer coma recibimos un solo parametro que es un objeto
    // con dos propiedades (lazyLoad y clean) y el (={}) es para indicar que ese parametro que en forma de objeto tambien puede llegar vacio o en el caso
    // que solo se envie en el objeto una sola propiedad
    if (clean) { // preguntamos si tiene que limpiar o no los resultados de peliculas, es decir si es true (limpia el contenedor) y si es false (no limpia el contenedor)
        container.innerHTML = "";//limpiamos nuestras secciones para evitar errores de duplicados de las api que retorna las 20 peliculas
        // y la api que retorna las categorias de peliculas al momento de navegar entre las diferentes vistas

    }

    movies.forEach(movie => { //por cada una de las peliculas que estemos agregando el forEach hay que llamar al observador de esa pelicula para agregarla
        const movieContainer = document.createElement('div');//creo el div que va a contener la imagen de la pelicula
        movieContainer.classList.add('movie-container')// le agrego al div la class="movie-container"
        /*movieContainer.addEventListener('click',() => {
            location.hash = '#movie='+movie.id;//nos dirige a la vista del hash (#movie=) que es la vista de detalle pelicula y le concatenamos el id de la pelicula
        });*/
        const movieImage = document.createElement('img'); // creo la imagen que va estar dentro del div(movieContainer)
        movieImage.classList.add('movie-img') //le agrego a la imgen la class="movie-img"
        movieImage.setAttribute('alt', movie.title)// agrego el atributo (alt) con su valor a la (img)
        // movieImage.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path,);       
        //si (lazyLoad) es true entonces agrego la ruta de la imagen a 'data-img' y sino agrego la ruta a 'src'
        movieImage.setAttribute(lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path,);//agrego el atributo (src) con su valor  
        movieImage.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;//nos dirige a la vista del hash (#movie=) que es la vista de detalle pelicula y le concatenamos el id de la pelicula
        });
        const movieBtn = document.createElement('button');  //creo el boton el cual el usuario va  apoder marcar o desdemarcar como pelicula favorita en la nueva seccion
        movieBtn.classList.add('movie-btn'); // Agrego la clase al boton para cualquier seccion que tenga peliculas
        movieBtn.addEventListener('click', () => {//Le adiciono al boton el evento (click) para que cuando el usuario le da clic a la pelicula esta se gurade en favortios
            movieBtn.classList.toggle('movie-btn--liked');//cambia el estilo del boton para cuando el usuario le da click al boton            
            likeMovie(movie);//funcion que guarda o elimina la pelicula del localStorage --> pasamos como parametro la pelicula
        });

        if (lazyLoad) {//si el parametro (lazyLoad) es true agrego la imagen para que la observe mi (lazyLoader)
            lazyLoader.observe(movieImage);//llamo al observador de la pelicula para vigilarla, de esta manera agrego cada una de las imagenes al array de(entries)  
        }
        movieImage.addEventListener('error', () => {
            //enviamos una imagen por defecto que se quiera mostrar cuando las imagenes de las peliculas no cargen
            movieImage.setAttribute('src', 'https://static.platzi.com/static/images/error/img404.png')
        })
        movieContainer.appendChild(movieImage)//agergo la imagen al div (movieContainer)  
        movieContainer.appendChild(movieBtn)//agrego el boton al div (movieContainer)      
        container.appendChild(movieContainer)//agrego en  elemento seccion(container) del DOM el contenedor(div) que contiene la imagen de la pelicula
    });

}

//UTILS (Esta funcion es genericas o recursiva)
//FUNCION QUE CREA CADA UNA DE LAS CATEGORIAS DEL LISTADO DE CATEGORIAS Y LAS UBICA EN EL RESPECTIVO CONTENEDOR
//recibo como parametros el array de las categorias y el contenedor de donde se deben insertar() esas categorias
function createCategories(categories, container) {
    container.innerHTML = "";//limpiamos nuestras secciones para evitar errores de duplicados de las api que retorna las 20 peliculas
    // y la api que retorna las categorias de peliculas al momento de nabegar entre las diferentes vistas
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');//creo el div que va a contener el titulo del genero de la pelicula
        categoryContainer.classList.add('category-container')// le agrego al div la class="category-container"
        const categoryTitle = document.createElement('h3'); // creo la el titulo que va estar dentro del div(categoryContainer)
        categoryTitle.classList.add('category-title') //le agrego a al titulo la class="category-title"
        categoryTitle.setAttribute('id', 'id' + category.id) // agrego el atributo (id) con su valor al titulo (h3)
        categoryTitle.addEventListener('click', () => {//creo un evento para que cada ves que le de click en la categoria me lleve a la vista de esa catgeoria en especifica
            //location.hash = '#category='+category.id+'-'+category.name//en la url el hash(#category) esta esperando que le concatenen el (id de la categoria) para saber a cual vista tiene que ir
            location.hash = `#category=${category.id}-${category.name}`//esta line hace lo mismo que la linea anterior (manera adecuada el codigo queda mucho mas limpio)
        });
        const categoryTitleText = document.createTextNode(category.name)    //creo el texto del titulo del titulo         
        categoryTitle.appendChild(categoryTitleText)// le meto el texto al titulo      
        categoryContainer.appendChild(categoryTitle)//agergo el titulo con su texto al div
        //agrego el div que contiene el titulo con su texto al articulo que se ecuentra dentro de la seccion
        container.appendChild(categoryContainer)
    })

}


//CON AXIOS
//FUNCION QUE CONSUME LA API QUE TRAE EL LISTADO DE IMAGENES DE LAS 20 PELICULAS QUE SON TENDENCIA DE MANERA HORIZONTAL
async function getTrendingMoviesPreview() {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir -->GET  /trending/{media_type}/{time_window} --> ('trending/movie/day')
    const { data } = await api('trending/movie/day');
    //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
    const movies = data.results;
    console.log({ data, movies })
    //createMovies(movies, getTrendingMoviesPreview)
    createMovies(movies, trendingMoviesPreviewList, true)//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies y 
    //el contenedor(trendingMoviesPreviewList)) y el parametro true que indica que a ese contenedor si se le aplica (lazyLoading)  


}

//SIN AXIOS
/*async function getCategoriesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key='+API_KEY);
    const data = await res.json();

    const categories = data.genres;
    console.log({data,categories});
    categories.forEach(category => {
       // console.log(category)// imprimo cada uno de los objetos del array, es decir imprimo cada una de las categories
       //selecciono el elemento seccion que tiene id = categoriesPreview y dentro de la seccion 
       //selecciono el elemento con la class="categoriesPreview-list que corresponde al elemento articulo
       const categoriesPreviewSection = document.querySelector('#categoriesPreview .categoriesPreview-list')
       const categoryContainer = document.createElement('div');//creo el div que va a contener el titulo del genero de la pelicula
       categoryContainer.classList.add('category-container')// le agrego al div la class="category-container"

       const categoryTitle = document.createElement('h3'); // creo la el titulo que va estar dentro del div(categoryContainer)
       categoryTitle.classList.add('category-title') //le agrego a al titulo la class="category-title"
       categoryTitle.setAttribute('id', 'id'+ category.id) // agrego el atributo (id) con su valor al titulo (h3)
       const categoryTitleText = document.createTextNode(category.name)    //creo el texto del titulo del titulo  
       
       categoryTitle.appendChild(categoryTitleText)// le meto el texto al titulo      
       categoryContainer.appendChild(categoryTitle)//agergo el titulo con su texto al div
       //agrego el div que contiene el titulo con su texto al articulo que se ecuentra dentro de la seccion
       categoriesPreviewSection.appendChild(categoryContainer)
    })
}*/


//CON AXIOS
//FUNCION QUE CONSUME LA API QUE TRAE LAS CATEGORIAS PREVIAS DE PELICULA
async function getCategoriesPreview() {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET('/genre/movie/list')
    const { data } = await api('genre/movie/list');
    //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
    const categories = data.genres;
    console.log({ data, categories });
    createCategories(categories, categoriesPreviewList)////llamo a la funcion createCategories y le paso como parametro(la lista de 20 movies y     
    //el contenedor(categoriesPreviewList))    
}

//CON AXIOS
//FUNCION QUE CONSUME LA API QUE TRAE LAS PELICULAS DE UNA CATEGORIA
async function getMoviesByCategory(id) {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET ('/discover/movie')
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,// se pasa como parametro el (id de la categoria) que sera enviado a nuestra movies
        },
    });
    //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
    const movies = data.results;
    maxPage = data.total_pages;
    console.log("maxPage = ", maxPage)
    console.log({ movies })
    createMovies(movies, genericSection, { lazyLoad: true })//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies, 
    //el contenedor(genericSection) ---> contenedor que muestra la lista de imagenes de las 20 peliculas de forma vertical en el hash (#category=))
    //y el valor de true que indica que se aplicara el (lazyLoading) para que solo cragen las imagenes del Viewport es decir las imagenes que el
    //usuario esta viendo en ese momento y a medidad que baje el scroll pues se van mostrando las otras imagenes de peliculas.

}

//CON AXIOS
//FUNCION QUE CONSUME LA API QUE TRAE LAS PELICULAS DE UNA CATEGORIA
function getPaginatedMoviesByCategory(id) {
    return async function () {
        //document.documentElement.scrollTop+document.documentElement.clientHeight >= document.documentElement.scrollHeight    
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;//creo una constante y destructuro todo lo que venda de (documentElement)
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //el scroll realizado por el usuario llego al final
        const pageIsNotmax = page < maxPage // preguntamos si la pagina en que estamos es < maxPage proceda con el scroll infinito
        if (scrollIsBottom && pageIsNotmax) {//pregunto si el scroll realizado por el usuario llego al final y si la variable (pageIsNotmax) es true
            page++;//cada ves que llaman a esta funcion --> page incrementa en 1, de esta manera se lleva el control de las paginaciones para que sea dinamico    
            //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
            //Solo se coloca el recurso de la api que se quiere consumir ---> GET ('/discover/movie')
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,// se pasa como parametro el (id de la categoria) que sera enviado a nuestra movies
                    page,
                },
            });
            //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)

            //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
            const movies = data.results;
            console.log({ data, movies })
            //createMovies(movies, genericSection,true,false)
            createMovies(movies, genericSection, { lazyLoad: true, clean: false })//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies, el contenedor(genericSection)) y
            // el parametro true que indica quue si se aplica el (lazyLoader) es decir la carga perezosa del array de imagenes de peliculas y tambien le paso el parametro false
            //que indica que no se limpia el contenedor que muestra las peliculas que son tendencia de forma vertical con el fin de que se muestre el acumulado de las imagenes
            //de peliculas de las respectivas paginaciones, recuerde que cada paginacion tiene una lista de imagenes de peliculas que son tendencia.En base a lo anterior cuando
            //haga click en el boton (Load more) no me van a desaparecer imagenes de peliculas de la paginacion inicial sino que las conserva y muestra las imagenes de peliculas
            //que son tendencia de la siguiente paginacion y asi sucesivamente.

        }

        //EL CODIGO DEL BOTON LO COMENTAREO YA QUE NO QUIERO QUE ME APARESCA POR ENDE EN LA FUNCION (getTrendingMovies()) TAMBIEN DEBO COMENTAREA EL EVENTO DEL BOTON
        /*
        //cada ves que se llame esta funcion vuelvo y creo el boton
        const btnLoadMore = document.createElement('button');//creo el boton al cual se le hara click para cragar mas imagenes de peliculas que son tendencia
        btnLoadMore.innerText = 'Load more';//texto del boton cargar mas(load more)   
        genericSection.appendChild(btnLoadMore)//inserto el boton en la seccion (genericSection).appendChild() Es uno de los métodos fundamentales de la programación web usando el DOM. 
        //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, 
        //crear-y-añadir para construir páginas web a base de programación.
        btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)//al boton le adiciono un detector de eventos cada ves que hagamos 'click' al boton (Load more)
        // para que llame a la funcion (getPaginatedTrendingMovies())*/
    }

}

//CON AXIOS
//FUNCION QUE CONSUME EL API QUE TRAE LAS PELICULAS SEGUN EL PARAMETRO DE BUSQUEDA INGRESADO POR EL USUARIO EN EL INPUT DEL SEARCH
async function getMoviesBySearch(query) {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir --> GET ('/search/movie')    
    const { data } = await api('search/movie', {
        params: {
            query: query,// se pasa como parametro el (query) que es el dato ingresado por el usuario en el input del search
            //query,//cuando el parametro se escribe igual que el valor, solo basta con colocar el parametro seguido de una coma
        },
    });
    //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
    const movies = data.results;//Obtenemos el resultado que retornado por el consumo de la api
    maxPage = data.total_pages;
    console.log('maxPage', maxPage)
    console.log({ data, movies })
    createMovies(movies, genericSection, true)//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies, el 
    //contenedor(genericSection) ---> contenedor que muestra la lista de imagenes de las 20 peliculas de forma vertical en el hash (#category=)) y el
    //y el parametro true que indica que si se aplica el (lazyLoader) es decir la carga perezosa del array de imagenes de peliculas.


}

//CON AXIOS
//FUNCION QUE TRAE LAS PELICULAS QUE SON TENDENCIA DE MANERA VERTICAL SEGUN EL PARAMETRO DE PAGINACION
function getPaginatedMoviesBySearch(query) {
    return async function () {
        //document.documentElement.scrollTop+document.documentElement.clientHeight >= document.documentElement.scrollHeight    
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;//creo una constante y destructuro todo lo que venda de (documentElement)
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //el scroll realizado por el usuario llego al final
        const pageIsNotmax = page < maxPage // preguntamos si la pagina en que estamos es < maxPage proceda con el scroll infinito
        if (scrollIsBottom && pageIsNotmax) {//pregunto si el scroll realizado por el usuario llego al final y si la variable (pageIsNotmax) es true
            page++;//cada ves que llaman a esta funcion --> page incrementa en 1, de esta manera se lleva el control de las paginaciones para que sea dinamico    
            //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
            //Solo se coloca el recurso de la api que se quiere consumir --> GET ('/search/movie')    
            const { data } = await api('search/movie', {
                params: {
                    query: query,// se pasa como parametro el (query) que es el dato ingresado por el usuario en el input del search
                    //query,//cuando el parametro se escribe igual que el valor, solo basta con colocar el parametro seguido de una coma
                    page,
                },
            });

            //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
            const movies = data.results;
            console.log({ data, movies })
            //createMovies(movies, genericSection,true,false)
            createMovies(movies, genericSection, { lazyLoad: true, clean: false })//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies, el contenedor(genericSection)) y
            // el parametro true que indica quue si se aplica el (lazyLoader) es decir la carga perezosa del array de imagenes de peliculas y tambien le paso el parametro false
            //que indica que no se limpia el contenedor que muestra las peliculas que son tendencia de forma vertical con el fin de que se muestre el acumulado de las imagenes
            //de peliculas de las respectivas paginaciones, recuerde que cada paginacion tiene una lista de imagenes de peliculas que son tendencia.En base a lo anterior cuando
            //haga click en el boton (Load more) no me van a desaparecer imagenes de peliculas de la paginacion inicial sino que las conserva y muestra las imagenes de peliculas
            //que son tendencia de la siguiente paginacion y asi sucesivamente.

        }

        //EL CODIGO DEL BOTON LO COMENTAREO YA QUE NO QUIERO QUE ME APARESCA POR ENDE EN LA FUNCION (getTrendingMovies()) TAMBIEN DEBO COMENTAREA EL EVENTO DEL BOTON
        /*
        //cada ves que se llame esta funcion vuelvo y creo el boton
        const btnLoadMore = document.createElement('button');//creo el boton al cual se le hara click para cragar mas imagenes de peliculas que son tendencia
        btnLoadMore.innerText = 'Load more';//texto del boton cargar mas(load more)   
        genericSection.appendChild(btnLoadMore)//inserto el boton en la seccion (genericSection).appendChild() Es uno de los métodos fundamentales de la programación web usando el DOM. 
        //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, 
        //crear-y-añadir para construir páginas web a base de programación.
        btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)//al boton le adiciono un detector de eventos cada ves que hagamos 'click' al boton (Load more)
        // para que llame a la funcion (getPaginatedTrendingMovies())*/
    }

}



//CON AXIOS
//FUNCION QUE CONSUME EL API QUE TRAE LAS IMAGENES DE LAS 20 PELICULAS QUE SON TENDENCIA DE MANERA VERTICAL (est vista se presenta al momento de dar click en el boton "Ver mas")
async function getTrendingMovies() {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET /trending/{media_type}/{time_window} ---> ('trending/movie/day')
    const { data } = await api('trending/movie/day');
    //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
    const movies = data.results;
    maxPage = data.total_pages// esta variable max_page se accede desde cualquier parte de la aplicacion, esta variable contiene el total de paginaciones de peliculas
    console.log('Total de paginas = ' + data.total_pages)//imprimimos el total de paginas existentes de peliculas  
    console.log({ data, movies })
    //createMovies(movies, genericSection,true)
    createMovies(movies, genericSection, { lazyLoad: true, clean: true })//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies, el contenedor(genericSection)) y
    // el objeto que contiene dos propiedades ({lazyLoad:true, clean:true})  la primera propiedad indica que si se aplica el (lazyLoader) es decir la carga perezosa
    // del array de imagenes de peliculas y la segunda propiedad indica que si se limpia el contenedor que muestra las imagenes de peliculas que son tendencia de forma vertical

    /* COMENTAREO EL CODIGO DEL BOTON YA QUE LA IDEA ES QUE EL USARIO NO TENGA QUE HACER CLICK EN EL BOTON (Load more) PARA VER LA SIGUIENTE PAGINACION DE PELICULAS QUE SON TENDENCIA
     const btnLoadMore = document.createElement('button');//creo el boton al cual se le hara click para cragar mas imagenes de peliculas que son tendencia
     btnLoadMore.innerText = 'Load more';//texto del boton cargar mas(load more)   
     genericSection.appendChild(btnLoadMore)//inserto el boton en la seccion (genericSection).appendChild() Es uno de los métodos fundamentales de la programación web usando el DOM. 
     //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, 
     //crear-y-añadir para construir páginas web a base de programación.
     btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)//al boton le adiciono un detector de eventos cada ves que hagamos 'click' al boton (Load more)
     // para que llame a la funcion (getPaginatedTrendingMovies())*/
}

//let page = 1;// variable que lleva el control de las paginaciones
//window.addEventListener('scroll',getPaginatedTrendingMovies)//llamo a window y escucho cualquier evento que sea de tipo scroll que realice el usuario 
// y llamo a la funcion (getPaginatedTrendingMovies()) que consume la api que trae la lista de imagenes de peliculas que son tendencia de forma vertical segun el numero de paginacion

//CON AXIOS
//FUNCION QUE TRAE LAS PELICULAS QUE SON TENDENCIA DE MANERA VERTICAL SEGUN EL PARAMETRO DE PAGINACION
async function getPaginatedTrendingMovies() {
    //document.documentElement.scrollTop+document.documentElement.clientHeight >= document.documentElement.scrollHeight    
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;//creo una constante y destructuro todo lo que venda de (documentElement)
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //el scroll realizado por el usuario llego al final
    const pageIsNotmax = page < maxPage // preguntamos si la pagina en que estamos es < maxPage proceda con el scroll infinito
    if (scrollIsBottom && pageIsNotmax) {//pregunto si el scroll realizado por el usuario llego al final y si la variable (pageIsNotmax) es true
        page++;//cada ves que llaman a esta funcion --> page incrementa en 1, de esta manera se lleva el control de las paginaciones para que sea dinamico
        //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
        //Solo se coloca el recurso de la api que se quiere consumir ---> GET /trending/{media_type}/{time_window} ---> ('trending/movie/day')
        const { data } = await api('trending/movie/day', {
            params: {
                // page: 2// LE ESPECIFICO QUE SE TRAIGA LAS PELICULAS QUE SON TENDENCIA DE LA PAGINACION 2
                page
            }
        });
        //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
        const movies = data.results;
        console.log({ data, movies })
        //createMovies(movies, genericSection,true,false)
        createMovies(movies, genericSection, { lazyLoad: true, clean: false })//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies, el contenedor(genericSection)) y
        // el parametro true que indica quue si se aplica el (lazyLoader) es decir la carga perezosa del array de imagenes de peliculas y tambien le paso el parametro false
        //que indica que no se limpia el contenedor que muestra las peliculas que son tendencia de forma vertical con el fin de que se muestre el acumulado de las imagenes
        //de peliculas de las respectivas paginaciones, recuerde que cada paginacion tiene una lista de imagenes de peliculas que son tendencia.En base a lo anterior cuando
        //haga click en el boton (Load more) no me van a desaparecer imagenes de peliculas de la paginacion inicial sino que las conserva y muestra las imagenes de peliculas
        //que son tendencia de la siguiente paginacion y asi sucesivamente.

    }

    //EL CODIGO DEL BOTON LO COMENTAREO YA QUE NO QUIERO QUE ME APARESCA POR ENDE EN LA FUNCION (getTrendingMovies()) TAMBIEN DEBO COMENTAREA EL EVENTO DEL BOTON
    /*
    //cada ves que se llame esta funcion vuelvo y creo el boton
    const btnLoadMore = document.createElement('button');//creo el boton al cual se le hara click para cragar mas imagenes de peliculas que son tendencia
    btnLoadMore.innerText = 'Load more';//texto del boton cargar mas(load more)   
    genericSection.appendChild(btnLoadMore)//inserto el boton en la seccion (genericSection).appendChild() Es uno de los métodos fundamentales de la programación web usando el DOM. 
    //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, 
    //crear-y-añadir para construir páginas web a base de programación.
    btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)//al boton le adiciono un detector de eventos cada ves que hagamos 'click' al boton (Load more)
    // para que llame a la funcion (getPaginatedTrendingMovies())*/

}

//CON AXIOS
//FUNCION QUE CONSUME EL API QUE TRAE EL DETALLE DE LA PELICULA SEGUN SU EL ID DE LA PELICULA
async function getMoviesById(movieId) {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET /movie/{movie_id}
    const { data: movieDetail } = await api('movie/' + movieId);   //{ data:movieDetail } ---> renombro la variable (data) por (movieDetail) 
    const movieImageUrl = 'https://image.tmdb.org/t/p/w500/' + movieDetail.poster_path;//poster_path es la propiedad que almacena la url de la imagen / le damos un w500 es decir le damos un valor mucho mayor de ancho de la img
    console.log(movieImageUrl);//imprimo por consola la url de la imagen
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImageUrl})`;//ponemos la imagen en el background
    console.log({ movieDetail });
    //las siguientes variables (movieDetailTitle,movieDetailDescription,movieDetailScore) se encuentran en el archivo (node.js) y en el index se ubican en la seccion (section id="movieDetail")
    movieDetailTitle.textContent = movieDetail.title;//le meto al (movieDetailTitle) el titulo de la pelicula
    movieDetailDescription.textContent = movieDetail.overview;// le meto al (movieDetailDescription) la descripcion de la pelicula
    movieDetailScore.textContent = movieDetail.vote_average;// le meto al (movieDetailScore) el voto promedio es decir las puntuacion estrellitas
    //llamo a la funcion que retorna la lista de categorias y le paso como parametro las categorias y el contenedor donde va a poner esas categorias
    createCategories(movieDetail.genres, movieDetailCategoriesList)
    //pongo las peliculas recomendadas de una pelicula en la vista detalle de pelicula
    getRelatedMoviesId(movieId)//llamo a la funcion que consume el api que retorna las imagenes de las peliculas relacionadas(recomendadas) de manera horizontal


}

//CON AXIOS
//FUNCION QUE CONUME EL API QUE RETORNA EL LISTADO DE PELICULAS SIMILARES(RECOMENDADAS) DE UNA PELICULA A PARTIR DEL (ID DE LA PELICULA) de manera horizantal 
async function getRelatedMoviesId(movieId) {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET /movie/{movie_id}/recommendations
    const { data } = await api(`movie/${movieId}/recommendations`);
    const relatedMovies = data.results //variable que guarda un array con cada uno de los objetos(es decir cada objeto es una pelicula recomendada)
    //llamo a la funcion crea las peliculas y le paso como parametro las lista de peliculas recomendadas, el contenedor donde va a poner esas peliculas recomendadas en la vista de detalle pelicula y
    //el parametro true que indica que si se aplica el (lazyLoader) es decir la carga perezosa del array de imagenes de peliculas
    createMovies(relatedMovies, relatedMoviesContainer, true)

}

//getTrendingMoviesPreview();
//getCategoriesPreview();
//millos