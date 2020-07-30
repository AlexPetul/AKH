mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleHBldHVsIiwiYSI6ImNrN2t4d203cDAyODczbG10MWV5OW81eTYifQ.QiHe1vd_4ugNwU7m51WmTg';
var map = new mapboxgl.Map({
    container: 'map',
    center: [37.375181269449385, 55.7128970055779],
    zoom: 15,
    bearing: 0,
    style: 'mapbox://styles/mapbox/streets-v11'
});

var geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [37.375181269449385, 55.7128970055779]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [37.375181269449385, 55.7128970055779]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        },

        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [37.375181269449385, 55.7228970055779]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [37.375181269449385, 55.7228970055779]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        },

    ],

};

geojson.features.forEach(function (marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
});