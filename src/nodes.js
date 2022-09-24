// Sections
const headerSection = document.querySelector('#header');//capturo el elemento header del (DOM)que tiene (id="header")
const trendingPreviewSection = document.querySelector('#trendingPreview');//capturo el elemento section del (DOM) que tiene (id="trendingPreview")
const categoriesPreviewSection = document.querySelector('#categoriesPreview');//capturo el elemento section del (DOM) que tiene (id="categoriesPreview")
const genericSection = document.querySelector('#genericList');//capturo el elemento section del (DOM) que tiene (id="genericList")
const movieDetailSection = document.querySelector('#movieDetail');//capturo el elemento section del (DOM) que tiene (id="movieDetail")

// Lists & Containers
const searchForm = document.querySelector('#searchForm');//capturo el hash(#searchForm) del (DOM) 
const trendingMoviesPreviewList = document.querySelector('.trendingPreview-movieList');//capturo el elemento articulo del (DOM) que tiene la clase (class="trendingPreview-movieList")
const categoriesPreviewList = document.querySelector('.categoriesPreview-list');//capturo el elemento articulo del (DOM) que tiene la clase (class="categoriesPreview-list)
//capturo el elemento articulo del(DOM) que tiene la clase(categories-list) y que se encuentra dentro de un section del (DOM) que tiene (id="movieDetail")
const movieDetailCategoriesList = document.querySelector('#movieDetail .categories-list');
//capruto el elemento div del (DOM) que tiene la clase(class="relatedMovies-scrollContainer")
const relatedMoviesContainer = document.querySelector('.relatedMovies-scrollContainer');

// Elements
const headerTitle = document.querySelector('.header-title');//capturo el elemento titulo(h1) del (DOM) que tiene como clase (header-title)
const arrowBtn = document.querySelector('.header-arrow');//capturo el elemento span del (DOM) que tiene como clase (class="header-arrow") --> flecha atras 
//capturo el elemento titulo(h1) del (DOM) que tiene como clase class="header-title header-title--categoryView
const headerCategoryTitle = document.querySelector('.header-title--categoryView');

const searchFormInput = document.querySelector('#searchForm input');//capturo el elemento input del (DOM) que se encuentra en el elemento formulario que tiene (id="searchForm")
const searchFormBtn = document.querySelector('#searchBtn');//capturo el boton del (DOM) que tiene como clase class="searchBtn"

const trendingBtn = document.querySelector('.trendingPreview-btn');//capturo el boton del (DOM) que tiene como clase(class="trendingPreview-btn")

const movieDetailTitle = document.querySelector('.movieDetail-title');//capturo el h1(titulo) del (DOM) que tiene como clase(class="movieDetail-title")
const movieDetailDescription = document.querySelector('.movieDetail-description');//captuto el p del (DOM) que tiene como clase(class="movieDetail-description")
const movieDetailScore = document.querySelector('.movieDetail-score');//capturo el span del (DOM) que tiene como clase(class="movieDetail-score")

