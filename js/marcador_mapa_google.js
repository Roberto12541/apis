//se ingresa la API KEY proporcionada por el profesor
const API_KEY_MAPAS="AIzaSyA1CeHWCrKWFUUsULkPfxljaxCFPntJmzQ"
let map;
let utnLab;
let marcador;

//Creación del script y llamado;
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPAS}&callback=initMap`;
script.async = true;

//Adjuntar la llamada al mapa para su uso:
window.initMap = function () {
    utnLab = { lat: 19.4040032, lng: -98.9880654};
    map = new google.maps.Map(document.getElementById("divMapaGoogle"), {
    center: utnLab,
    zoom: 19.54,
    });
    marcador = new google.maps.Marker({
        position: utnLab,
        map: map
    });
};

//Agregar el script a la cabecera:
document.head.appendChild(script);