/**
 * @author oasiao@cifpfbmoll.eu, smartinez@cifpfbmoll.eu
 * @version 1.0.0
 */
import {promociones} from "./modules/promociones.js";
//import {novedades} from "./modules/novedades.js";
import {calendario} from "./modules/calendario.js";


const app = {
    /**
     * obtiene los valores del DOM para operar con ellos
     */
    novedades: document.querySelector('.cartas-novedades'),
    promociones: document.querySelector('.cartas-promociones'),
    calendario: document.querySelector('.calendario'),
    /**
     * renderiza las novedades del módulo novedades.js
     */
    render: function () {

        const cookie = document.cookie.split(';').map(function(c) {
            return c.trim().split('=').map(decodeURIComponent);
        }).reduce(function(a, b) {
            try {
                a[b[0]] = JSON.parse(b[1]);
            } catch (e) {
                a[b[0]] = b[1];
            }
            return a;
        }, {});

        if(!['', null, undefined].includes(cookie.user.token)){
            const renderNovedades = async () => {
                const response = await fetch('http://localhost:3003/novedades');
                return await response.json();
            }
            renderNovedades().then(data => {
                data.forEach(novedad => {
                    this.novedades.innerHTML += `<div class="novedad">
                                            <img src="${novedad.Poster}" alt="${novedad.Title}">
                                            <h2>${novedad.Title}</h2>
                                            <p>${novedad.Year}</p>
                                        </div>`;
                });
            });

            const renderPromociones = async () => {
                const response = await fetch('http://localhost:3003/promociones');
                return await response.json();
            }
            renderPromociones().then(data => {
                data.forEach(promocion => {
                    this.promociones.innerHTML += `<div class="promocion">
                                            <img src="${promocion.Poster}" alt="${promocion.Titulo}">
                                            <h2>${promocion.Titulo}</h2>
                                        </div>`;
                });
            });
        } else {
            this.novedades.innerHTML = 'Logueate';
            this.promociones.innerHTML = 'Logueate';
        }

    },

    renderCalendario: function () {
        this.calendario.innerHTML += calendario.calendario();
    },

}
app.render();
app.renderCalendario();