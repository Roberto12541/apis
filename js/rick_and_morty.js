const URL_API_RICK_AND_MORTY = "https://rickandmortyapi.com/api/character/";
const MAXIMO_PERSONAJES = 825;
let indicePersonaje = 1;
let datos = null;

$(document).ready(function ()
    {
        obtenerDatos(); // Hacer la primera peticion con el id por default
    }
);

function mover(hacia)
{
    let huboMovimiento = false;
    let proximoValor = indicePersonaje;
    if(hacia == "R"){
        //Retrocedemos:
        proximoValor--;
        if(proximoValor <=0) {
            //NO
            alertify.alert('¡Atención! ', 'Ya estas al Inicio.');
        }else {
            //SI
            indicePersonaje--;
            huboMovimiento = true;
        }
    }else {
        //Avanzamos:
        proximoValor++;
        if(proximoValor >=MAXIMO_PERSONAJES){
            //NO
            alertify.alert('¡Atención!','Ya estas al Final.');
        }else {
            //SI
            indicePersonaje++;
            huboMovimiento = true;
        }
    }
    if(huboMovimiento){
        obtenerDatos();
    }
}

function pintarGeneroBiologico(queGenero)
{
    switch (queGenero){
        case 'Male':
            return '♂'; //Niño
            break;
        case 'Female':
            return '♀'; //Niña
            break;
        default:
            return '⚧'; //Otr@s y/o un Alien
            break;
    }
}

function construirURL()
{
    return URL_API_RICK_AND_MORTY +indicePersonaje;
}

function limpiarDatos()
{
    $('#imgPersonaje').attr("src", "https://www.utn.red/imagenes/rick_and_morty.png");
    $('#h5Nombre').html("SIN_NOMBRE");
    $('#pTexto').html("SIN_DATOS");
    $('h1Genero').html("♂ ♀ ⚧");
}

function pintarDatos()
{
    $('#imgPersonaje').attr("src", datos.image);
    $('h5Nombre').html(datos.name);
    $('pTexto').html(`${datos.species} ${datos.status}`);
    $('#h1Genero').html( pintarGeneroBiologico(datos.gender) );
    //console.log (datos);
}

async function obtenerDatos()
{
    let url = construirURL();
    let respuesta = await fetch(url);
    if( !respuesta.ok){
        alertify.alert('¡Atención!', 'Ocurrio algo, mira el log');
        console.log ('ESTATUS:' + respuesta.status);
        limpiarDatos();
    }
    datos = await respuesta.json();
    pintarDatos();
}

obtenerDatos().catch(error => {
    alertify.alert ('¡Atención!', 'Ocurrio un error, mira el log');
    console.log ('ERROR: '+ error.message);
    limpiarDatos();
});

