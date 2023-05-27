//se ingresa la API KEY proporcionada por el profesor
const API_KEY_MAPAS="AIzaSyA1CeHWCrKWFUUsULkPfxljaxCFPntJmzQ"
let map;

//creación del script y llamado:
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPAS}&callback=initMap`;
script.async = true;

//Adjuntar la llamada al mapa para su uso:
window.initMap = function () {
    map = new google.maps.Map(document.getElementById("divMapaGoogle"), {
        center: { lat: 19.4040675, lng: -98.9865747},
        zoom: 15,
    });
};

//Agregar el script a la cabecera:
document.head.appendChild(script);