/**
 * @author oasiao@cifpfbmoll.eu, smartinez@cifpfbmoll.eu
 * @version 1.0.0
 */
//import {cartelera} from './modules/cartelera.js';
import {
    imageAsButton
} from './modules/movieDescription.js';

const renderCartelera = {
    /**
     * variables que obtienen elementos del DOM
     */
    cartelera: document.querySelector('.cartelera'),
    elementosOscurecer: ['.header', '.cartelera', '.footer'],
    modal: document.querySelector('.modal-contenedor'),
    scroll: document.querySelector('.scroll'),
    add: document.querySelector('#add'),
    edit: document.querySelector('#submit'),
    /**
     * renderiza la cartelera a prueba de errores
     */
    renderCartelera: function () {

        let tituloRep = "";
        const uri = 'http://localhost:3001/cartelera';

        const data = async () => {
            let data = await fetch(uri);
            let json = await data.json();

            console.log(json);

            this.cartelera.innerHTML += `<h2 class="carteleraTitulo">CARTELERA</h2>`;

            json.forEach(pelicula => {
                if (tituloRep !== pelicula.Title) {
                    this.cartelera.innerHTML += this.renderPeliculas(pelicula);
                    tituloRep = pelicula.Title;
                    //contador++;
                    this.listenerBotones(pelicula);
                    this.mostrarFormAnadir();
                    this.cerrarVentana();
                    this.filter(pelicula);
                }
            });
        }
        data(uri);
    },
    /**
     * listener de los botones mediante un addEventListener()
     */
    listenerBotones: function (pelicula) {

        const botones = document.querySelectorAll('.edicion');
        const peliculas = document.querySelectorAll('.pelicula');

        botones.forEach(boton => {
            boton.addEventListener('click', function () {

                peliculas.forEach(peli => {
                    if (boton.getAttribute('id') === peli.getAttribute('id')) {
                        if (boton.getAttribute('name') === 'borrar') {
                            this.borrarCarta(pelicula);
                        } else {
                            document.getElementById('form').reset();
                            this.mostrarFormEdicion(peli.getAttribute('name'), pelicula);
                        }
                    }
                })
            }.bind(this))
        });

        imageAsButton();
        this.back();
    },
    /**
     * borra la película de la lista
     * @param carta
     */
    borrarCarta: function (pelicula) {
        const uri = `http://localhost:3001/cartelera/${pelicula.id}`;

        const deleteData = async (uri) => {
            let data = await fetch(uri, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let content = data.json();
            console.log(content);
            location.reload();
        }

        deleteData(uri);


    },
    /**
     * muestra el formulario de edición
     * @param pelicula
     */
    mostrarFormEdicion: function (peli, pelicula) {

        this.elementosOscurecer.forEach(elemento => {
            document.querySelector(elemento).classList.add('opacidad-fondo');
        });

        this.edit.style.display = "block";
        this.add.style.display = "none";
        this.modal.style.display = "block";
        this.scroll.style.display = "none";
        let inputForms = document.querySelectorAll('.inputForm');


        this.editarCarta(pelicula);
    },
    /**
     * cierra la ventana del formulario
     */
    cerrarVentana: function () {
        document.querySelector('.boton-cerrar').addEventListener('click', function () {
            this.elementosOscurecer.forEach(elemento => {
                document.querySelector(elemento).classList.remove('opacidad-fondo');
            });
            this.modal.style.display = "none";
            this.scroll.style.display = "block";
        }.bind(this));
    },
    /**
     * edita la carta hacía la cartelera
     * @param pelicula
     */
    editarCarta: function (pelicula) {
        document.getElementById('submit').addEventListener('click', function (event) {
            event.preventDefault();
            const formId = document.getElementById('form');
            const form = new FormData(formId);
            let formObject = {};

            this.elementosOscurecer.forEach(elemento => {
                document.querySelector(elemento).classList.remove('opacidad-fondo');
            });

            this.modal.style.display = "none";
            this.scroll.style.display = "block";

            form.forEach((value, key) => {
                formObject[key] = value;
            });

            formObject['Poster'] = `img/subir/${formObject.Poster.name}`
            //cartelera.push(formObject);
            // ACTUALIZAR ELEMENTO API REST
            const uri = `http://localhost:3001/cartelera/${pelicula.id}`;

            const updateData = async (uri) => {
                let data = await fetch(uri, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });

                let content = data.json();
                console.log(content);
                location.reload();
            }
            updateData(uri);

        }.bind(this));

    },

    mostrarFormAnadir: function (pelicula) {
        document.querySelector('.add-button').addEventListener('click', function () {
            document.getElementById('form').reset();
            this.elementosOscurecer.forEach(elemento => {
                document.querySelector(elemento).classList.add('opacidad-fondo');
            });
            this.modal.style.display = "block";
            this.edit.style.display = "none";
            this.add.style.display = "block";
            this.scroll.style.display = "none";
            this.anadirElemento();
        }.bind(this));
    },
    /**
     * añade un elemento a la cartelera
     */
    anadirElemento: function () {
        document.getElementById('add').addEventListener('click', function (event) {
            event.preventDefault();
            const formId = document.getElementById('form');
            const form = new FormData(formId);
            let formObject = {};

            if (this.camposValidados()) {

                form.forEach((value, key) => {
                    formObject[key] = value;
                });

                formObject['Poster'] = `img/subir/${formObject.Poster.name}`
                //cartelera.push(formObject);
                // AÑADIR ELEMENTO API REST
                const uri = 'http://localhost:3001/cartelera';

                const addData = async (uri) => {
                    let data = await fetch(uri, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formObject)
                    });

                    let content = data.json();
                    console.log(content);
                }
                addData(uri);

                this.elementosOscurecer.forEach(elemento => {
                    document.querySelector(elemento).classList.remove('opacidad-fondo');
                });

                this.edit.style.display = "block";
                this.add.style.display = "none";
                this.modal.style.display = "none";
                this.scroll.style.display = "block";

                location.reload();
            }


        }.bind(this))
    },
    /**
     * filtra películas por género, año o título
     */
    filter: function (pelicula) {
        document.getElementById("filterButton").addEventListener('click', function (event) {
            event.preventDefault();
            // let contador = 0;
            const filter = document.getElementById('filterInput').value;
            const uri = `http://localhost:3001/cartelera/${filter}`;

            const filterData = async (uri) => {

                let respuesta = await fetch(uri);
                if (respuesta.status === 200) {
                    let pelicula = await respuesta.json();
                    return await pelicula;
                } else {
                    this.cartelera.innerHTML = 'No se han encontrado resultados';
                }

            };

            filterData(uri).then(pelicula => {

                this.cartelera.innerHTML = `<div id="${pelicula.id}" class="pelicula" name="${pelicula.Title}" >
                                            <div id="${pelicula.id}" class="img-container" name="${(pelicula.Title).toLowerCase()}" ><img src="${pelicula.Poster}" alt="${pelicula.Title}"></div>
                                            
                                            <div class="text-content">
                                                <h2 class="titulo-pelicula">${(pelicula.Title).toUpperCase()}</h2>
                                                <h3 class="subtitulo-pelicula">${(pelicula.Genre).toLowerCase()} / 
                                                ${(pelicula.Year).toLowerCase()} / ${(pelicula.Runtime).toLowerCase()}</h3>
                                            
                                            <br><div class="horarios">DIGITAL
                                                    <button>15:50</button>
                                                    <button>20:25</button>                                                
                                            </div>
                                            <div class="ediciones">
                                            <button id="${pelicula.id}" class="edicion" name="editar"><i class="far fa-edit"></i></button>
                                            <button id="${pelicula.id}" class="edicion" name="borrar"><i class="far fa-trash-alt"></i></button>
                                            </div>
                                            </div>
                                         </div>`;
            });



            // let select = document.getElementById('filter');
            // let option = select.options[select.selectedIndex].value;
            // this.cartelera.innerHTML = `<h1>CARTELERA</h1>`;
            // cartelera.forEach(pelicula => {
            //     if (option === 'Year') {
            //         if (pelicula.Year === filter) {
            //             this.cartelera.innerHTML += this.renderPeliculas(pelicula, contador);
            //             contador++;
            //         }
            //     } else if (option === 'Title') {
            //         let titulo = pelicula.Title.toLowerCase();
            //         if (titulo.includes(filter)) {
            //             this.cartelera.innerHTML += this.renderPeliculas(pelicula, contador);
            //             contador++;
            //         }
            //     } else if (option === 'Genre') {
            //         let genero = pelicula.Genre.toLowerCase();
            //         if (genero.includes(filter)) {
            //             this.cartelera.innerHTML += this.renderPeliculas(pelicula, contador);
            //             contador++;
            //         }
            //     } else {
            //         console.log("ERROR");
            //     }
            // });

            //document.getElementById('cleanFilter').style.display = "block";

            // if (contador === 0) {
            //     document.querySelector('.cartelera').innerHTML += `No hay resultados para tu búsqueda.`;
            // }

            // this.renderCartelera();;

            // this.cleanFilter();
            // this.listenerBotones(pelicula);
            // this.filter();
            this.listenerBotones(pelicula);

        }.bind(this));

    },
    /**
     * limpia el filtro
     */
    cleanFilter: function () {
        document.getElementById('cleanFilter').addEventListener('click', function () {
            document.getElementById('cleanFilter').style.display = "none";
            document.getElementById('filterInput').value = "";
            this.cartelera.innerHTML = "";
            this.filter();
            this.renderCartelera();
            this.listenerBotones(pelicula);

        }.bind(this));
    },
    renderPeliculas: function (pelicula) {
        return `<div id="${pelicula.id}" class="pelicula" name="${pelicula.Title}" >
                                            <div id="${pelicula.id}" class="img-container" name="${(pelicula.Title).toLowerCase()}" ><img src="${pelicula.Poster}" alt="${pelicula.Title}"></div>
                                            
                                            <div class="text-content">
                                                <h2 class="titulo-pelicula">${(pelicula.Title).toUpperCase()}</h2>
                                                <h3 class="subtitulo-pelicula">${(pelicula.Genre).toLowerCase()} / 
                                                ${(pelicula.Year).toLowerCase()} / ${(pelicula.Runtime).toLowerCase()}</h3>
                                            
                                            <br><div class="horarios">DIGITAL
                                                    <button>15:50</button>
                                                    <button>20:25</button>                                                
                                            </div>
                                            <div class="ediciones">
                                            <button id="${pelicula.id}" class="edicion" name="editar"><i class="far fa-edit"></i></button>
                                            <button id="${pelicula.id}" class="edicion" name="borrar"><i class="far fa-trash-alt"></i></button>
                                            </div>
                                            </div>
                                         </div>`;

    },
    /**
     * valida los campos del formulario
     * @returns {boolean}
     */
    camposValidados: function () {
        let inputForms = document.querySelectorAll('.inputForm');
        let validated = true;
        inputForms.forEach(input => {
            if (input.value === "" || input.value === null) {
                validated = false;
                input.classList.add('campoVacio');
            } else {
                input.classList.remove('campoVacio');
            }
        });

        return validated;
    },
    /**
     * función para cerrar el filtro
     */
    back: function () {
        document.getElementById('back').addEventListener('click', function () {
            document.querySelector('.filter').style.display = "flex";
            document.querySelector('.add-button').style.display = "block";
            document.querySelector('.divBack').style.display = "none";
            document.querySelector('.pelicula-content').innerHTML = "";
            this.cartelera.innerHTML = "";
            this.renderCartelera();
            imageAsButton();
            this.listenerBotones(pelicula);
            this.filter();
        }.bind(this));
    }
    /*datePicker : function() {
        $( "#datePicker" ).datepicker({
            dateFormat: 'dd-mm-yy'
        });
    }*/
}

renderCartelera.renderCartelera();