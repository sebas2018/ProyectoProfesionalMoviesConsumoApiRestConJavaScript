/*console.log('hola')
console.log('API URL= https://fgdsgdsgdsfgds.com/dfsfsdf?api_key='+API_KEY)*/
//import { API_KEY } from "./secrets";

//creamos una instancia de axios
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',// URL Base para solictude a las Apis
    headers: {
        'Content-Type': 'application/json;charset=utf-8',//formato de respuesta del servidor (json)
    },
    params: {
        'api_key': API_KEY,//Api_key (autorizacion)
    }
});

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


//UTILS (Esta funcion es genericas o recursiva)
//FUNCION QUE CREA CADA UNA DE LAS PELICULAS DEL LISTADO DE PELICULAS Y LAS UBICA EN EL RESPECTIVO CONTENEDOR
//recibo como parametros el array de las 20 peliculas y el contenedor de donde se deden insertar() esas peliculas
function createMovies(movies, container) {
    container.innerHTML = "";//limpiamos nuestras secciones para evitar errores de duplicados de las api que retorna las 20 peliculas
    // y la api que retorna las categorias de peliculas al momento de nabegar entre las diferentes vistas
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');//creo el div que va a contener la imagen de la pelicula
        movieContainer.classList.add('movie-container')// le agrego al div la class="movie-container"
        movieContainer.addEventListener('click',() => {
            location.hash = '#movie='+movie.id//nos dirige a la vista del hash (#movie=) que es la vista de detalle pelicula y le concatenamos el id de la pelicula
        })
        const movieImage = document.createElement('img'); // creo la imagen que va estar dentro del div(movieContainer)
        movieImage.classList.add('movie-img') //le agrego a la imgen la class="movie-img"
        movieImage.setAttribute('alt', movie.title)// agrego el atributo (alt) con su valor a la (img)
        movieImage.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path)//agrego el atributo (src) con su valor       
        movieContainer.appendChild(movieImage)//agergo la imagen al div (movieContainer)        
        container.appendChild(movieContainer)//agrego en  elemento seccion(container) del DOM el contenedor(div) que contiene la imagen de la pelicula
    })

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
    createMovies(movies, trendingMoviesPreviewList)//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies y 
    //el contenedor(trendingMoviesPreviewList))
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
    createCategories(categories,categoriesPreviewList)////llamo a la funcion createCategories y le paso como parametro(la lista de 20 movies y 
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
    console.log({ movies })
    createMovies(movies, genericSection)//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies y 
    //el contenedor(genericSection) ---> contenedor que muestra la lista de imagenes de las 20 peliculas de forma vertical en el hash (#category=))

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
    console.log({ data, movies})
    createMovies(movies, genericSection)//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies y 
    //el contenedor(genericSection) ---> contenedor que muestra la lista de imagenes de las 20 peliculas de forma vertical en el hash (#category=))

}

//CON AXIOS
//FUNCION QUE CONSUME EL API QUE TRAE LAS IMAGENES DE LAS 20 PELICULAS QUE SON TENDENCIA DE MANERA VERTICAL
async function getTrendingMovies() {
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET /trending/{media_type}/{time_window} ---> ('trending/movie/day')
    const { data } = await api('trending/movie/day');
    //const data = await res.json();//esta linea sobra por que axios ya nos parsea el resultado a formato json como se observa en la linea (44)
    const movies = data.results;
    console.log({ data, movies })
    createMovies(movies, genericSection)//llamo a la funcion createMovies y le paso como parametro(la lista de 20 movies y 
    //el contenedor(genericSection))
}

//CON AXIOS
//FUNCION QUE CONSUME EL API QUE TRAE EL DETALLE DE LA PELICULA SEGUN SU EL ID DE LA PELICULA
async function getMoviesById(movieId){
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET /movie/{movie_id}
    const { data:movieDetail } = await api('movie/'+movieId);   //{ data:movieDetail } ---> renombro la variable (data) por (movieDetail) 
    const movieImageUrl = 'https://image.tmdb.org/t/p/w500/' + movieDetail.poster_path;//poster_path es la propiedad que almacena la url de la imagen / le damos un w500 es decir le damos un valor mucho mayor de ancho de la img
    console.log(movieImageUrl);//imprimo por consola la url de la imagen
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImageUrl})`;//ponemos la imagen en el background
    console.log({movieDetail});
    //las siguientes variables (movieDetailTitle,movieDetailDescription,movieDetailScore) se encuentran en el archivo (node.js) y en el index se ubican en la seccion (section id="movieDetail")
    movieDetailTitle.textContent = movieDetail.title;//le meto al (movieDetailTitle) el titulo de la pelicula
    movieDetailDescription.textContent = movieDetail.overview;// le meto al (movieDetailDescription) la descripcion de la pelicula
    movieDetailScore.textContent = movieDetail.vote_average;// le meto al (movieDetailScore) el voto promedio es decir las puntuacion estrellitas
    //llamo a la funcion que retorna la lista de categorias y le paso como parametro las categorias y el contenedor donde va a poner esas categorias
    createCategories(movieDetail.genres,movieDetailCategoriesList)
    //pongo las peliculas recomendadas de una pelicula en la vista detalle de pelicula
    getRelatedMoviesId(movieId)//llamo a la funcion que consume el api que retorna las imagenes de las peliculas relacionadas(recomendadas) de manera horizontal

}

//CON AXIOS
//FUNCION QUE CONUME EL API QUE RETORNA EL LISTADO DE PELICULAS SIMILARES(RECOMENDADAS) DE UNA PELICULA A PARTIR DEL (ID DE LA PELICULA)
async function getRelatedMoviesId(movieId){
    //No es necesario colorcar 'https://api.themoviedb.org/3/' ni concatenar el API_KEY  ya que ya se encuentra en la instacia de axios (api)
    //Solo se coloca el recurso de la api que se quiere consumir ---> GET /movie/{movie_id}/recommendations
    const { data } = await api(`movie/${movieId}/recommendations`);
    const relatedMovies = data.results //variable que guarda un array con cada uno de los objetos(es decir cada objeto es una pelicula recomendada)
    //llamo a la funcion crea las peliculas y le paso como parametro las lista de peliculas recomendadas y el contenedor donde va a poner esas peliculas recomendadas en la vista de detalle pelicula
    createMovies(relatedMovies,relatedMoviesContainer)
}

//getTrendingMoviesPreview();
//getCategoriesPreview();
//millos