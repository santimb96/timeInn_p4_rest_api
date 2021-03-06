/**
 * @author oasiao@cifpfbmoll.eu, smartinez@cifpfbmoll.eu
 * @version 1.0.0
 */
//import {cartelera} from './modules/cartelera.js';
import {imageAsButton} from './modules/movieDescription.js';

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
        /**
         * OBTENER DATA (GET)
         * @type {string}
         */
        let tituloRep = "";
        const uri = 'http://localhost:3002/cartelera';

        const data = async () => {
            let data = await fetch(uri);
            let json = await data.json();

            /*console.log(json)
            let url = await json.Poster;
            console.log(url);
            let resImg = await fetch(url);
            let blob = await resImg.blob();
            img.src = URL.createObjectURL(blob);*/

            //console.log(json);

            this.cartelera.innerHTML += `<h2 class="carteleraTitulo">CARTELERA</h2>`;

            for (const pelicula of json) {
                const blobbingImg = async (pelicula) => {
                    let resImg = await fetch(pelicula);
                    let blob = await resImg.blob();
                    let img = document.createElement('img');
                    img.src = URL.createObjectURL(blob);
                    return img;
                }
                const image = await blobbingImg(pelicula.Poster);
                console.log(pelicula);
                //console.log(image.outerHTML);
                    //outerHTML parsea el objeto blob a text para insertar en el HTML-
                    this.cartelera.innerHTML += this.renderPeliculas(pelicula, image.outerHTML);
                    tituloRep = pelicula.Title;
                    //contador++;
                    this.listenerBotones(json);
                    this.mostrarFormAnadir();
                    this.cerrarVentana();
                    this.filter(pelicula);

            }
        }
        data(uri);
    },
    /**
     * listener de los botones mediante un addEventListener()
     */
    listenerBotones: function (pelicula) {

        console.log(pelicula)
        const botones = document.querySelectorAll('.edicion');
        const peliculas = document.querySelectorAll('.pelicula');
        let peliId = "";

        botones.forEach(boton => {
            boton.addEventListener('click', function () {

                peliculas.forEach(peli => {
                    if (boton.getAttribute('id') === peli.getAttribute('id')
                    ) {
                        peliId = peli.getAttribute('id');
                        if (boton.getAttribute('name') === 'borrar') {
                            pelicula.forEach(peli => {
                                if(peli.id === +peliId){
                                    this.borrarCarta(peli);
                                }
                            });
                        } else {
                            document.getElementById('form').reset();
                            pelicula.forEach(peli => {
                               if(peli.id === +peliId){
                                   this.mostrarFormEdicion(peli);
                               }
                            });
                        }
                    }
                })
            }.bind(this))
        });

        imageAsButton(pelicula);
        this.back(pelicula);
    },
    /**
     * borra la pel??cula de la lista
     * @param carta
     */
    borrarCarta: function (pelicula) {
        /**
         * DELETE
         * @type {string}
         */
        const uri = `http://localhost:3002/cartelera/${pelicula.id}`;

        const deleteData = async (uri) => {
            await fetch(uri, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }

        deleteData(uri).then(() => {
            location.reload();
        });


    },
    /**
     * muestra el formulario de edici??n
     * @param pelicula
     */
    mostrarFormEdicion: function (pelicula) {

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
     * edita la carta hac??a la cartelera
     * @param pelicula
     */
    editarCarta: function (pelicula) {
        console.log(pelicula)
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
            /**
             * EDITAR (UPDATE)
             * @type {string}
             */
            const uri = `http://localhost:3002/cartelera/${pelicula.id}`;

            const updateData = async (uri) => {
                await fetch(uri, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });
            }
            updateData(uri).then(() => {
                location.reload();
            });

        }.bind(this));

    },

    mostrarFormAnadir: function () {
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
     * a??ade un elemento a la cartelera
     */
    anadirElemento: function () {
        document.getElementById('add').onclick = function (event) {
            event.preventDefault();
            const formId = document.getElementById('form');
            const form = new FormData(formId);
            let obj = {};

            form.forEach((value, key) => {
                obj[key] = value;
            });

            obj['Poster'] = `img/subir/${obj.Poster.name}`

            /**
             * A??ADIR (POST)
             * @param obj
             * @returns {Promise<void>}
             */
            const addData = async (obj) => {
                const uri = 'http://localhost:3002/cartelera'
                const settings = {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    headers: {
                        'Content-Type': 'application/json'
                    },

                };
                let response = await fetch(uri, settings);
                console.log(await response.json());
                location.reload();
            }
            addData(obj).catch(e => {
                console.error(e)
            });

        }.bind(this);
    },
    /**
     * filtra pel??culas por g??nero, a??o o t??tulo
     */
    filter: function () {
        document.getElementById("filterButton").addEventListener('click', function (event) {
            event.preventDefault();
            // let contador = 0;
            /**
             * FILTER
             */
            const filter = document.getElementById('filterInput').value;
            const uri = `http://localhost:3002/cartelera/${filter}`;

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
                this.listenerBotones(pelicula);
            });
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
    renderPeliculas: function (pelicula, img) {
        return `<div id="${pelicula.id}" class="pelicula" name="${pelicula.Title}" >
                                            <div id="${pelicula.id}" class="img-container" name="${(pelicula.Title).toLowerCase()}" >${img}</div>
                                            
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
     * funci??n para cerrar el filtro
     */
    back: function () {
        document.getElementById('back').addEventListener('click', function () {
            location.reload();
        }.bind(this));
    }
}

renderCartelera.renderCartelera();
