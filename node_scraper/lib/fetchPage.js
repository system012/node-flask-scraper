import fetch from 'node-fetch';
import cheerio from 'cheerio';

export function getProductPage(code) {
    return fetch(`http://127.0.0.1:5000/amz/${code}`)// connessione al server locale in flask
        .then(response => response.text())
        .then(msg => JSON.parse(msg).message)// il server ritorna un json con un unico valore associato alla chiave "message": il valore è il DOM della pagina amazon sotto forma di stringa
        .then(cheerio.load)
        .catch(error => console.error(error))
};