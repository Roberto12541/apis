const URL_API_MARVEL = "https://gateway.marvel.com:443/v1/public/";
const KEY_PUBLICA = 'ec7c5a766b48d241d5285c647f4d53e1';
const KEY_PRIVADA = 'f5ca4a4cf9c1e370962d95ac0323847c6b21b680';
let marcaTiempo = '';
let parametros = '';
let html = '';
let url = '';
let respuesta = null;
let datos = null;
let jsonPersonajes = null;
let objetoPersonaje = null;
let offset = 0;

$(document).ready(function () {

}); 

function marcarTiempo ()
{
    marcaTiempo = new Date().getTime();
}


function crearHash()
{
    return CryptoJS.MD5( marcaTiempo + KEY_PRIVADA + KEY_PUBLICA );
}

function crearParametros()
{
   marcarTiempo();
   parametros = '';
   parametros += 'characters?limit=20&offset=' + offset + '&ts=';
   parametros += marcaTiempo;
   parametros += '&apikey=';
   parametros += KEY_PUBLICA;
   parametros += '&hash=';
   parametros += crearHash();
   url = URL_API_MARVEL + parametros; 
}

async function obtenerDatos()
{
    crearParametros();
    window.scrollTo( {top: 1 , left: 1, behavior: 'smooth' } );
    respuesta = await fetch(url);
    if ( !respuesta.ok ) {
        alertify.alert('¡Atención!', 'Ocurrio algo, mira el log.' );
        console.log('ESTATUS: ' + respuesta.status);
        limpiarDatos();
    }
    datos = await respuesta.json();
    pintarDatos();
}

function limpiarDatos ()
{
    $("#tbodyDatos > tr").remove();
    $("#tbodyDatos").append( '<tr class="trDatos"><td>Esperando datos...</td></tr>' );
}

function pintarDatos()
{
    jsonPersonajes = datos.data.results;
    offset += jsonPersonajes.length;
    $("#tbodyDatos > tr").remove();
    if(jsonPersonajes.length > 0) {
        //Si hay personajes:
        html = '';
        for(indice=0; indice<jsonPersonajes.length; indice++) {
            objetoPersonaje = jsonPersonajes[indice];
            html += '<tr class="trDatos">';
                html += '<td>';
                    html += '<div class="card mb-3">';
                    html += '<div class="row g-0">';
                    html += '<div class="col-md-4">';
                        html += '<img src="' + (objetoPersonaje.thumbnail.path).replace("http", "https") + '.';
                        html += objetoPersonaje.thumbnail.extension + '" class="img-fluid rounded-start" alt="';
                        html += objetoPersonaje.name + '">';
                    html += '</div>';
                    html += '<div class="col-md-8">';
                    html += '<div class="card-body">';
                    html += '<h5 id="h5_' + objetoPersonaje.id + '" class="card-title">' + objetoPersonaje.name + '</h5>';
                    objetoPersonaje.description = (objetoPersonaje.description=="")? 'No hay descripción':objetoPersonaje.description;
                    html += '<p class="card-text">' + objetoPersonaje.description + '</p>';
                    html += '<p class="card-text"><small class="text-muted">';
                    html += objetoPersonaje.comics.available + ' Comic(s) disponible(s).<br />';
                    html += objetoPersonaje.series.available + ' Serie(s) disponible(s).<br />';
                    html += objetoPersonaje.stories.available + ' Historia(s) disponible(s).<br>';
                    html += objetoPersonaje.events.available + ' Evento(s) disponible(s).<br>';
                    html += '</small></p>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                html += '</td>';
            html += '</tr>';
        }
    } else {
        //No hay personajes:
        html = '<tr class="trDatos"><td>No hay Datos...</td><Itr>';
    }
    $("#tbodyDatos").append( html );
}

obtenerDatos().catch(error => {
    alertify.alert('¡AtenciOn!', 'Ocurrio un error, mira el log.');
    console.log('ERROR: ' + error.message);
    limpiarDatos();
});
