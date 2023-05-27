let map = new ol.Map
(
    {
    target:'divMapa',
    layers:
        [
        new ol.layer.Tile
        ({
            source: new ol.source.OSM()
        })    
        ],
    view: new ol.View
        ({
        center: ol.proj.fromLonLat([-98.9865747, 19.4040675]),
        zoom: 17
        })
    }
);