//SE INGRESA API KEY DE GOOGLE DEVELOPERS
const API_KEY_MAPAS = "AIzaSyAIJZnr2AFbW1ycSHRynOQL0PqayjaS63k"
let map;
let objetoInfoWindow;

//creación del script y llamado:
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPAS}&callback=initMap`;
script.async = true;

//ADJUNTAR LA LLAMADA AL MAPA PARA SU USO:
window.initMap = function () {
    map = new google.maps.Map(document.getElementById("divMapaGoogle"), {
        center: { lat: 19.4040675, lng: -98.9865747},
        zoom: 15,
    });
    objetoInfoWindow = new google.maps.InfoWindow();
    const botonLocalizacion = document.createElement("button");
    botonLocalizacion.textContent = "Moverse a tu Localización";
    botonLocalizacion.classList.add("boton-mapa");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(botonLocalizacion);
    botonLocalizacion.addEventListener("click",()=>{
        //Intentar la Geolocalizacion:
        if(navigator.geolocation){
            //Si:
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const posicion = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    objetoInfoWindow.setPosition(posicion);
                    objetoInfoWindow.setContent('<div class="text-success">Aqui estas</div>');
                    objetoInfoWindow.open(map);
                    map.setCenter(posicion);
                },
                () => {
                    mostrarError(true, objetoInfoWindow, map.getCenter());
                }
            );
        } else {
            //NO:
            mostrarError(false, objetoInfoWindow, map.getCenter());
        }
    });
};
function mostrarError(tieneGeolocalizacion, infoWindow, posicion){
    infoWindow.setPosition(posicion);
    infoWindow.setContent(
        tieneGeolocalizacion
        ?"Atención: El servicio de geolocalización falló."
        :"Atención: Tu navegador no soporta geolocalización"
    );
    infoWindow.open(map);
}
//Agregar el script a la cabecera
document.head.appendChild(script);