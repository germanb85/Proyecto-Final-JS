//https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
//http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// cargar películas desde API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";
        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "imagenes/image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Año: ${details.Year}</li>
            <li class = "rated">Clasificación: ${details.Rated}</li>
            <li class = "released">Fecha de estreno: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genero:</b> ${details.Genre}</p>
        <p class = "writer"><b>Guion:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actores: </b>${details.Actors}</p>
        <p class = "plot"><b>Trama:</b> ${details.Plot}</p>
        <p class = "language"><b>Idioma:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

swal({
    title: "Bienvenido a DP de película",
    text: "Click en OK para entrar",
    closeOnClickOutside: false,
});

// PELICULA PRINCIPAL Y CAROUSEL

const fila = document.querySelector('.contenedor-carousel');
const peliculas = document.querySelectorAll('.pelicula');

const flechaIzquierda = document.getElementById('flecha-izquierda');
const flechaDerecha = document.getElementById('flecha-derecha');

flechaDerecha.addEventListener('click', () => {
	fila.scrollLeft += fila.offsetWidth;
	const indicadorActivo = document.querySelector('.indicadores .activo');
	if(indicadorActivo.nextSibling){
		indicadorActivo.nextSibling.classList.add('activo');
		indicadorActivo.classList.remove('activo');
	}
});

flechaIzquierda.addEventListener('click', () => {
	fila.scrollLeft -= fila.offsetWidth;
	const indicadorActivo = document.querySelector('.indicadores .activo');
	if(indicadorActivo.previousSibling){
		indicadorActivo.previousSibling.classList.add('activo');
		indicadorActivo.classList.remove('activo');
	}
});

const numeroPaginas = Math.ceil(peliculas.length / 5);
for(let i = 0; i < numeroPaginas; i++){
	const indicador = document.createElement('button');
	if(i === 0){
		indicador.classList.add('activo');
	}

	document.querySelector('.indicadores').appendChild(indicador);
	indicador.addEventListener('click', (e) => {
		fila.scrollLeft = i * fila.offsetWidth;
		document.querySelector('.indicadores .activo').classList.remove('activo');
		e.target.classList.add('activo');
	});
}

peliculas.forEach((pelicula) => {
	pelicula.addEventListener('mouseenter', (e) => {
		const elemento = e.currentTarget;
		setTimeout(() => {
			peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
			elemento.classList.add('hover');
		}, 300);
	});
});

fila.addEventListener('mouseleave', () => {
	peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
});