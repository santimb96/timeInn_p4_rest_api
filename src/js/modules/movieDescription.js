import {cartelera} from './cartelera.js';

//export {pelicula}

const renderPelicula = {
    buttons: document.querySelectorAll('.img-container'),
    id: "",
    renderPeliculaDescription: function (peli) {
        document.querySelector('.pelicula-content').innerHTML +=
            `<div class="pelicula" name="${peli.Title}" >
                <div class="img-container" name="${(peli.Title).toLowerCase()}">
                    <img src="${peli.Poster}" alt="${peli.Title}">
                </div>
                <div class="text-content">
                    <h2 class="titulo-pelicula">${(peli.Title).toUpperCase()}</h2>
                    <h3 class="subtitulo-pelicula">
                        ${(peli.Genre).toLowerCase()} / 
                        ${(peli.Year).toLowerCase()} / 
                        ${(peli.Runtime).toLowerCase()}
                    </h3>
                    <h6>${(peli.Plot)}</h6>
                    <h5>Director: ${(peli.Director)} /
                    Released: ${(peli.Released)} /
                    Writer: ${(peli.Writer)} /
                    Actors: ${(peli.Actors)} /
                    Awards: ${(peli.Awards)} / </h5>
                    <h3>IMDB RATING: ${(peli.imdbRating)}</h3>
                </div>
               
            </div>`;
    }
};

export function imageAsButton(pelicula) {
    document.querySelectorAll('.img-container').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelector('.filter').style.display = "none";
            document.querySelector('.add-button').style.display = "none";
            document.querySelector('.divBack').style.display = "flex"
            document.querySelector('.cartelera').innerHTML = "";
            document.querySelector('.pelicula-content').innerHTML = "";
            let id = button.getAttribute('id');

            pelicula.forEach(peli => {
                if(peli.id === +id){
                    renderPelicula.renderPeliculaDescription(peli);
                }
            });
        });
    });
}

