let page = 1;// variable que lleva el control de las paginaciones

//escucho cuando le dan click a este boton de busqueda para que nos lleve a la vista del hash (#search=)
searchFormBtn.addEventListener('click', ()=>{
    //capturo el valor que ingresa el usuario en el input como parametros para buscar la pelicula de su interes y se lo concateno al hash (#search=)
    location.hash = '#search=' + searchFormInput.value;
})

//escucho cuando le dan click a este boton de (ver mas) para que nos lleve a la vista del hash (#trends)
trendingBtn.addEventListener('click', ()=>{
    location.hash = '#trends';
})

//escucho cuando le dan click a este boton de atras (<) para que nos lleve a la vista principal del hash (#home)
arrowBtn.addEventListener('click', ()=>{
    //me conserva el historial de navehacion de esta manera el usuario cuando de clcik en el botn de atras unas ves buscada varias peliculas lo dirigira a la pelicula anterior hasta llegar a la vista principal
    history.back();//nos lleva a la busqueda anterior de pelicula realizada por el usuario
    //location.hash = '#home' // nos lleve a la vista principal del hash (#home)
})

window.addEventListener('DOMContentLoaded', navigator, false);//llamamos a la funcion a ejecutarse(navigator) cuando crague por primera ves la aplicacion
window.addEventListener('hashchange', navigator, false);//llamamos a la funcion a ejecutarse(navigator) cada ves que cambie el hash
window.addEventListener('scroll',getPaginatedTrendingMovies)//llamo a window y escucho cualquier evento que sea de tipo scroll que realice el usuario 
// y llamo a la funcion (getPaginatedTrendingMovies()) que consume la api que trae la lista de imagenes de peliculas que son tendencia de forma vertical segun el numero de paginacion


//Esta funcion se crear para llamar a todas las funciones implementadas en main.js desde aca
//de esta manera no tenemos que llamarlas en el archivo (main.js)
//Esta funcion la llamo cuando cargue mi aplicacion y cada ves que cambie el hash
function navigator() {
    console.log({ location });

    if (location.hash.startsWith('#trends')) { // verifico si el hash empieza por (#trends)
        //console.log('entroa a la seccion de trends')
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {// verifico si el hash empieza por (#search=)
        //console.log('entro a la seccion de search')
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {// verifico si el hash empieza por (#movie=)
        //console.log('entro a la seccion de detalle pelicula')
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {// verifico si el hash empieza por (#category=)
        // console.log('entro a la seccion de categotia')
        categoryPage();
    } else { //si el hash no inicia por ninguna de las ateriores opciones entonces por defecto entra  a la seccion principal
        //console.log('entro a la seccion de Home(vista principal)')
        homePage();
    }

    ////ScrollTop de 0 para que siempre aperesca al inicio y no al final de la lista de imagenes de las 20 peliculas
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//funcion que habilita todos los elementos de la vista principal
function homePage() {
    console.log('entro a la seccion de Home(vista principal)')
    headerSection.classList.remove('header-container--long');//removemos de la vista (home) la (class="header-container--long") ya que esta ultima solo es para la vista (movieDetail)
    //para cuando se entra a la vista de (movie detail)se debe agregar con la etiqueta (style) en su propiedad(background) una imagen del poster de la pelicula de lo contrario 
    //si no se esta en la vista de (movie detail) debe mantener vacio, es decir sin unimage
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive')// en el la vista princiapl(home) inactivamos la flecha atras ya que no es necesario en la vista principal.
    arrowBtn.classList.remove('header-arrow--white')//desactivo la clase('header-arrow--white') de la vista (home) para que la flecha no sea de color blanco sino de moradito
    headerTitle.classList.remove('inactive')//activamos el titulo ("PlatziMovies") para que se muestre en la vista principal(home)
    headerCategoryTitle.classList.add('inactive')//escondemos el titulo("Acción") que tiene la clase (header-title--categoryView) ya que este solo se debe mostrar en la vista de (categorias)
    searchForm.classList.remove('inactive')//activo el formulario de busqueda en la vista principal(home)
    trendingPreviewSection.classList.remove('inactive')//activo la clase (trendingPreview-container) de seccion del DOM que tiene (id="trendingPreview") para que se muestre la seccion que contiene el un contenedor con el titulo(tendencias) y el boton(ver mas) y la lista de imagenes de las 20 peliculas
    categoriesPreviewSection.classList.remove('inactive')//activo la clase (categoriesPreview-container) del seccion del DOM que tiene (id="categoriesPreview") para que se muestre
    //ocultamos la seccion del DOM que tiene como (id="genericList") y que tiene como clase (genericList-container) ya que en la vista principal (home) 
    //la lista de peliculas se encuentra en horizontal y no en vertical
    genericSection.classList.add('inactive')
    //ocultamos la seccion del DOM que tiene como (id='movieDetail') y que tiene como clase (movieDetail-container) ya que en la vista principal(home) no se muestra el detalle de la pelicula con sus peliculas similares
    movieDetailSection.classList.add('inactive')
    //siempre en la vista principal de debe llamar las siguiente funciones:
    getTrendingMoviesPreview();//funcion que consume la api que retorna la lista de imagenes de las 20 peliculas en horizontal
    getCategoriesPreview();//funcion que consume la api que retorna la lista de categrias
}

//funcion que habilita todos los elementos de la vista del hash --> #category=
//Esta vista es la que muestra la lista de las imagenes de las 20 peliculas de una categoria de manera vertical --> vista del hash (#category=)
function categoryPage() {
    console.log('entro a la seccion de categotia')
    headerSection.classList.remove('header-container--long');//oculto la clase('header-container--long') de la vista (catgeory) 
    //para cuando se entra a la vista de (movie detail)se debe agregar con la etiqueta (style) en su propiedad(background) una imagen del poster de la pelicula de lo contrario 
    //si no se esta en la vista de (movie detail) debe mantener vacio, es decir sin imagen
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')//activamos en la vista (category) la flecha de atras para volver a la vista principal(home)
    arrowBtn.classList.remove('header-arrow--white')//activo la clase('header-arrow--white') la vista (category) para que la flecha sea de color moradito
    headerTitle.classList.add('inactive')//oculto el titulo ("PlatziMovies") ya que no se requiere en esta vista
    headerCategoryTitle.classList.remove('inactive')//activamos el titulo("Acción") en la vista de (category) 
    searchForm.classList.add('inactive')//oculto el formulario de busqueda en la vista de(category) ya que no se necesita
    trendingPreviewSection.classList.add('inactive')//oculto la seccion de la vista previa de tendencias (trendingPreview) ya que no se necesita en esta vista
    categoriesPreviewSection.classList.add('inactive')//oculto la seccion de la vista (categorias previas) ya que no se requiere.    
    genericSection.classList.remove('inactive')//activo la seccion del DOM que tiene como (id="genericList") ya que se requiere mostrar las lista vertical de peliculas de una categoria
    //ocultamos la seccion del DOM que tiene como (id='movieDetail') y que tiene como clase (movieDetail-container) ya que en la vista principal(home) no se muestra el detalle de la pelicula
    movieDetailSection.classList.add('inactive')//inactivo la seccion (movieDetailSection) ya que no se requiere mostrar los detalles de la pelicula en esta vista
    //debemos capturar de la siguiente url (file:///C:/Users/juan%20c/Desktop/frontend/JavaScript/ProyectoPracticoMoviesConsumoApiRestConJavaScript/index.html#category=16-Animation)
    //el hash(#category=) con su respectivo valor(16-Animation) es decir ['#category','id-name']
    const [_, categoryData] = location.hash.split('='); //separo el hash (#category=16-Animation) en dos partes que se dividen por el (=) -> como no me interesa la primera parte que es el hash(#category) pongo raya al piso (_)
    //posteriormente separado por coma sigue la segunda parte que es el valor del hash(16-Animation)
    const [categoryId, categoryName] = categoryData.split('-');//la segunda parte del hash(16-Animation) la separo en dos partes que se dividen por el (-)
    const categoryNewName = categoryName.replace('%20',' ') //remplazamos el espacio(%20) que exista en el nombre compuesto de la categoria por (cadenas vacias)
    // la primera el (id de la categoria) --> 16 y la segunda el (nombre de la categoria) --> (Animation)
    headerCategoryTitle.innerHTML = categoryNewName;//le colocamos el texto del genero de pelicula al titulo
    getMoviesByCategory(categoryId);//llamamos a la funcion que consume la api que retorna las peliculas de una categoria a partir del (id de la categoria)
    
}

//funcion que habilita todos los elementos de la vista que se encuentra en la vista de detalle pelicula
function movieDetailsPage() {
    console.log('entro a la seccion de detalle pelicula')
    
    //headerSection.style.background = '';
    headerSection.classList.add('header-container--long');//muestro la clase (header-container--long) en la vista (movieDetailsPage)
    arrowBtn.classList.remove('inactive')//activamos la vista (movieDetails) ya que se necesita la flecha de atras para volver a la vista principal(home)
    arrowBtn.classList.add('header-arrow--white')//muestro la clase('header-arrow--white') en la vista (movieDetails) para que la flecha se muestre con color blanco
    headerTitle.classList.add('inactive')//inactivamos el titulo ("PlatziMovies") ya que no se requiere en la vista de (movieDetails)
    headerCategoryTitle.classList.add('inactive')//inactivo el titulo("Acción") que representa el titulo de la categoria en la vista(movieDetail)
    searchForm.classList.add('inactive')//oculto el formulario de busqueda en la vista de(movieDetail) ya que no se necesita
    trendingPreviewSection.classList.add('inactive')//oculto la seccion de la vista previa de tendencias (trendingPreview) ya que no se necesita en la vista de (movieDetail)
    categoriesPreviewSection.classList.add('inactive')//oculto la seccion de la vista (categorias previas) ya que no se requiere ver la lista de las categorias de pelicula.    
    genericSection.classList.add('inactive')//inactivo la seccion del DOM que tiene como (id="genericList") para no mostrar las lista vertical de peliculas en esta vista 
    //ocultamos la seccion del DOM que tiene como (id='movieDetail') y que tiene como clase (movieDetail-container) ya que en la vista principal(home) no se muestra el detalle de la pelicula
    movieDetailSection.classList.remove('inactive')//activo  la seccion (movieDetailSection) para ver la lista de generos de pelicula
    //['#movie', '21654']
    const [_,movieId] = location.hash.split('=');//capturo el id de la pelicula del hash -->#movie=610150
    getMoviesById(movieId);//llamo a la funcion getMoviesById() y le paso el parmetro (movieId) ---> esta funcion consume el api que retorna el detalle de la pelicula segun el id de la pelicula
}

//funcion que habilita todos los elementos de la vista del hash --> #search=
//Esta vista es la que se despliega una ves damos clci en el boton buscar (lupita) de la vista principal --> muestra la info de la movie consultada 
function searchPage() {
    console.log('entro a la seccion de search')

    headerSection.classList.remove('header-container--long');//oculto la clase('header-container--long') de la vista (searchPage) 
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')//activamos la vista (category) ya que se necesita la flecha de atras para volver a la vista principal(home)
    arrowBtn.classList.remove('header-arrow--white')//descativo la clase('header-arrow--white') de la vista (searchPage) para que la flecha sea de color moradito
    headerTitle.classList.add('inactive')//oculto el titulo ("PlatziMovies") ya que no se requiere en esta vista
    headerCategoryTitle.classList.add('inactive')//desactivo el titulo("Acción") de la vista de (searchPage) ya que no se requiere
    
    searchForm.classList.remove('inactive')//muestro el formulario de busqueda en la vista de(searchPage) 
    trendingPreviewSection.classList.add('inactive')//oculto la seccion de la vista previa de tendencias (trendingPreview) ya que no se necesita en esta vista
    categoriesPreviewSection.classList.add('inactive')//oculto la seccion de la vista (categorias previas) ya que no se requiere.    
    genericSection.classList.remove('inactive')//activo la seccion del DOM que tiene como (id="genericList") para mostrar las lista vertical de peliculas encontradas segun el parametro de busqueda ingresada por el usuario
    //ocultamos la seccion del DOM que tiene como (id='movieDetail') y que tiene como clase (movieDetail-container) ya que en la vista principal(home) no se muestra el detalle de la pelicula
    movieDetailSection.classList.add('inactive')//desactivo la seccion (movieDetailSection) ya que se requiere mostrar los detalles de la pelicula
    //tengo que capturar del hash el valor ingresado por el usuario(millonarios) que se supone que es la pelicula a buscar --> #search=millonarios
    //['#search','millonarios'] --> el primer elemento del array('#search') no nos interesa, mientras que el segundo elemento del array ('millonarios') si nos interesa
    //const [_,query] = location.hash.split('='); //separo el hash (#search=millonarios) en dos partes que se dividen por el (=) -> como no me interesa la primera parte que es el hash(#search) pongo raya al piso (_)
    const query = decodeURI(location.hash.split("=")[1]);//hace lo mismo que la linea anterior pero es mas precisa cuando el usario usa un parametro de busqueda de la pelicula con una palabra compuesta como "the batman"

    getMoviesBySearch(query);//llamo a la funcion que consume el Api que retorna el resultado de las peliculas buscada por el parametro de entrada del usuario en el input del search de la vista principal

}

//funcion que habilita todos los elementos de la vista del hash --> #trends
//Esta vista es la que se despliega al daler click en el boton (ver mas) de la vista principal
//Esta vista muestra la lista de imagenes de las 20 peliculas que son tendencia de manera vertical
function trendsPage() {
    console.log('entroa a la seccion de trends')
    headerSection.classList.remove('header-container--long');//oculto la clase('header-container--long') de la vista (trendsPage) 
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')//activamos la flecha de atras para volver a la vista principal(home)
    arrowBtn.classList.remove('header-arrow--white')//descativo la clase('header-arrow--white') de la vista (trendsPage) para que la flecha sea de color moradito
    headerTitle.classList.add('inactive')//oculto el titulo ("PlatziMovies") ya que no se requiere en esta vista
    headerCategoryTitle.classList.remove('inactive')//activamos el titulo("Acción") en la vista de (trendsPage) ya que no se requiere 
    searchForm.classList.add('inactive')//oculto el formulario de busqueda en esta vista de(trendsPage) 
    trendingPreviewSection.classList.add('inactive')//oculto la seccion de la vista previa de tendencias (trendingPreview) ya que no se necesita en esta vista
    categoriesPreviewSection.classList.add('inactive')//oculto la seccion de la vista (categorias previas) ya que no se requiere.    
    genericSection.classList.remove('inactive')//oculto la secciondescativo la seccion del DOM que tiene como (id="genericList") ya que no se requiere mostrar las lista vertical de peliculas de una categoria
    //ocultamos la seccion del DOM que tiene como (id='movieDetail') y que tiene como clase (movieDetail-container) ya que en la vista (trendsPage) no se muestra el detalle de la pelicula
    movieDetailSection.classList.add('inactive')//inactivo la seccion (movieDetailSection) ya que no se requiere mostrar los detalles de la pelicula
    headerCategoryTitle.innerHTML = "Tendencias";
    getTrendingMovies();//llamos a la funcion que consume el api que retorna las imagenes de las 20 peliculas de forma vertical.
}
