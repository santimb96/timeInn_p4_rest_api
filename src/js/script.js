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
    msjNovedad: document.querySelector('.msj-log'),
    msjPromo: document.querySelector('.msj-promo'),
    promociones: document.querySelector('.cartas-promociones'),
    calendario: document.querySelector('.calendario'),
    /**
     * renderiza las novedades del módulo novedades.js
     */
    render: function () {

        const cookie = document.cookie.split(';').map(function (c) {
            return c.trim().split('=').map(decodeURIComponent);
        }).reduce(function (a, b) {
            try {
                a[b[0]] = JSON.parse(b[1]);
            } catch (e) {
                a[b[0]] = b[1];
            }
            return a;
        }, {});

        if (cookie.user !== undefined) {
            if (cookie.user.token !== "") {
                const renderNovedades = async () => {
                    const response = await fetch('http://localhost:3002/novedades');
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
                    const response = await fetch('http://localhost:3002/promociones');
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
            }
        } else {
            this.msjNovedad.innerHTML = `<div class="mensaje-login"><h2>NO ESTÁS LOGUEADO</h2><p>Por favor, clica <a class="msj-enlace" href="logIn.html">aquí</a> para iniciar sesión</p></div>`;
            this.msjPromo.innerHTML = `<div class="mensaje-login"><h2>NO ESTÁS LOGUEADO</h2><p>Por favor, clica <a class="msj-enlace" href="logIn.html">aquí</a> para iniciar sesión</p></div>`;
        }

    },

    renderCalendario: function () {
        this.calendario.innerHTML += calendario.calendario();
    },

}
app.render();
app.renderCalendario();