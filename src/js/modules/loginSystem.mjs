import {usuarios} from "./usuarios.mjs";

export const login = {
    emailPattern: /^[A-Za-z]{1}[a-z]+@[a-z]{5,10}\.(com|net|gov)+$/,
    passwordPattern: /^[a-zA-Z]{1}[a-zA-Z0-9]{6,8}[0-9]{2}$/,
    namePattern: /^[a-zA-Z0-9]{4,12}$/,

    validarTodo: function (email, password) {

        let validated = false;
        let user = "";

        if (this.validarEmail(email) && this.validarPassword(password)) {
            return true;
        } else {
            return false;
        }
    },
    /*validarToken: function (obj, token) {
        const cabecera = {"alg": "HS256", "typ": "JWT"};
        const cabeceraCodificada = Buffer.from(JSON.stringify(cabecera)).toString('base64');

        const datos = obj;
        const datosCodificados = Buffer.from(JSON.stringify(datos)).toString('base64');

        const crypto = require('crypto');
        const claveSecreta = 'clave_secreta';

        const firma = crypto.createHmac('sha256', claveSecreta).update(cabeceraCodificada + '.' + datosCodificados).digest('base64');

        const tokenJWT = `${cabeceraCodificada}.${datosCodificados}.${firma}`;

        console.log(tokenJWT);
        console.log(token);

        if(tokenJWT === token){
            return true;
        } else {
            return false;
        }
    },*/
    validarPassword: function (password) {
        return this.passwordPattern.test(password);
    },

    validarEmail: function (email) {
        return this.emailPattern.test(email);
    },

    validarName: function (name) {
        return this.namePattern.test(name);
    },

    passwordsIguales: function (password1, password2) {
        return password1 === password2;
    },
    register: function (email, password, password2) {
        //const user = {email, name, password};

        if (password === password2) {
            if (this.validarPassword(password) && this.validarEmail(email)) {
                //usuarios.push(user);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}