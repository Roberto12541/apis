let checkChismoso = null;
const objetoView = new ol.View(
    {
        center: ol.proj.fromLonLat([-98.9865747, 19.4040675]),
        zoom:13
    }
);

const objetoMapa = new ol.Map(
    {
        layers: [
            new ol.layer.Tile(
                {
                    source: new ol.source.OSM(),
                }
            ),
        ],
        target: 'divMapa',
        view: objetoView,
    }
);

const objetoGeolocalizador = new ol.Geolocation(
    {
        trackingOptions:
        {
            enableHighAccuracy: true,            
        },
        projection: objetoView.getProjection(),
    }
);

$(document).ready(function() {
    checkChismoso = document.getElementById("checkUbicacion");
    $("#checkUbicacion").prop("checked", false);
    checkChismoso.addEventListener("change", function () {
        objetoGeolocalizador.setTracking(this.checked);
    }
    );
    $('#tableDatos').hide();
} 
);

objetoGeolocalizador.on('change', function() {
    $('#tableDatos').show();
    $('#spanPrecision').html(objetoGeolocalizador.getAccuracy()+'[m]');
    $('#spanAltitud').html(objetoGeolocalizador.getAltitude()+'[m]');
    $('#spanPrecisionAltitud').html(objetoGeolocalizador.getAltitudeAccuracy()+'[m]');
    $('#spanRumbo').html(objetoGeolocalizador.getHeading()+'[rad]');
    $('#spanVelocidad').html(objetoGeolocalizador.getSpeed()+'[m/s]');
}
);

objetoGeolocalizador.on('error', function (error){
    alertify.alert('¡Algo no salió bien!', error.message);
}
);

const accuracyFeature = new ol.Feature();
objetoGeolocalizador.on('change:accuracyGeometry', function () {
    accuracyFeature.setGeometry(objetoGeolocalizador.getAccuracyGeometry());
}
);

const positionFeature = new ol.Feature();
positionFeature.setStyle(
    new ol.style.Style(
    {
        image: new ol.style.Circle(
        {
            radius: 6,
            fill: new ol.style.Fill(
                {
                    color: '#3399CC',
                }
            ),
            stroke: new ol.style.Stroke(
                {
                    color: '#fff',
                    width: 2,
                }
            )
        }
        )
    }
    )
);

objetoGeolocalizador.on('change:position', function(){
    const coordinates = objetoGeolocalizador.getPosition();
    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
}
);

new ol.layer.Vector(
    {
        map: objetoMapa,
        source: new ol.source.Vector(
            {
                features: [accuracyFeature, positionFeature],
            }
        ),
    }
);