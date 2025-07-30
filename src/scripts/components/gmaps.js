// Google Maps component initialization
import GMaps from 'gmaps';

// Wait for Google Maps API to be loaded
window.initializeMaps = function() {
    // Basic Map
    if (document.getElementById('basic-map')) {
        const basicMap = new GMaps({
            el: '#basic-map',
            lat: -12.043333,
            lng: -77.028333,
            zoomControl: true,
            zoomControlOpt: {
                style: 'SMALL',
                position: 'TOP_LEFT'
            },
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            overviewMapControl: false
        });
    }

    // Fusion Tables Map
    if (document.getElementById('map-2')) {
        const infoWindow2 = new google.maps.InfoWindow({});
        const map2 = new GMaps({
            el: '#map-2',
            zoom: 11,
            lat: 41.850033,
            lng: -87.6500523
        });
        
        // Note: Fusion Tables was deprecated in 2019 and shut down in 2020
        // This example would need to be updated to use a different data source
        console.warn('Fusion Tables has been deprecated. Consider using Google Maps Data Layer or other alternatives.');
    }

    // Geometry Overlays Map
    if (document.getElementById('map-3')) {
        const map3 = new GMaps({
            el: '#map-3',
            lat: -12.043333,
            lng: -77.028333
        });

        const bounds = [
            [-12.030397656836609, -77.02373871559225],
            [-12.034804866577001, -77.01154422636042]
        ];
        
        map3.drawRectangle({
            bounds: bounds,
            strokeColor: '#BBD8E9',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#BBD8E9',
            fillOpacity: 0.6
        });

        const paths = [
            [-12.040397656836609, -77.03373871559225],
            [-12.040248585302038, -77.03993927003302],
            [-12.050047116528843, -77.02448169303511],
            [-12.044804866577001, -77.02154422636042]
        ];
        
        map3.drawPolygon({
            paths: paths,
            strokeColor: '#25D359',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#25D359',
            fillOpacity: 0.6
        });

        map3.drawCircle({
            lat: -12.040504866577001,
            lng: -77.02024422636042,
            radius: 350,
            strokeColor: '#432070',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#432070',
            fillOpacity: 0.6
        });

        // Fit bounds
        const allBounds = [...bounds, ...paths];
        const latLngBounds = allBounds.map(coord => 
            new google.maps.LatLng(coord[0], coord[1])
        );
        map3.fitLatLngBounds(latLngBounds);
    }

    // Elevation Map
    if (document.getElementById('map-4')) {
        const map4 = new GMaps({
            el: '#map-4',
            lat: -12.043333,
            lng: -77.028333
        });

        map4.getElevations({
            locations: [
                [-12.040397656836609, -77.03373871559225],
                [-12.050047116528843, -77.02448169303511],
                [-12.044804866577001, -77.02154422636042]
            ],
            callback: function(result, status) {
                if (status == google.maps.ElevationStatus.OK) {
                    result.forEach(location => {
                        map4.addMarker({
                            lat: location.location.lat(),
                            lng: location.location.lng(),
                            title: 'Marker with InfoWindow',
                            infoWindow: {
                                content: `<p>The elevation is ${location.elevation.toFixed(2)} meters</p>`
                            }
                        });
                    });
                }
            }
        });
    }

    // Geolocation Map
    if (document.getElementById('map-5')) {
        const map5 = new GMaps({
            el: '#map-5',
            lat: -12.043333,
            lng: -77.028333
        });

        GMaps.geolocate({
            success: function(position) {
                map5.setCenter(position.coords.latitude, position.coords.longitude);
                map5.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: 'Your Location',
                    infoWindow: {
                        content: '<p>You are here!</p>'
                    }
                });
            },
            error: function(error) {
                console.error('Geolocation failed:', error.message);
            },
            not_supported: function() {
                console.warn('Your browser does not support geolocation');
            }
        });
    }

    // KML Layer Map
    if (document.getElementById('map-6')) {
        const infoWindow6 = new google.maps.InfoWindow({});
        const map6 = new GMaps({
            el: '#map-6',
            zoom: 12,
            lat: 40.65,
            lng: -73.95
        });

        // Note: Example KML URL, replace with actual KML feed
        console.warn('KML example - ensure the KML URL is valid and accessible');
    }

    // Weather Layers Map
    if (document.getElementById('map-7')) {
        const map7 = new GMaps({
            el: '#map-7',
            lat: -12.043333,
            lng: -77.028333,
            zoom: 3
        });

        // Note: Weather and cloud layers require additional API setup
        try {
            map7.addLayer('weather', {
                clickable: false
            });
            map7.addLayer('clouds');
        } catch (e) {
            console.warn('Weather layers require additional API configuration');
        }
    }

    // Map Events
    if (document.getElementById('map-8')) {
        const map8 = new GMaps({
            el: '#map-8',
            zoom: 16,
            lat: -12.043333,
            lng: -77.028333,
            click: function(e) {
                console.log('Map clicked at:', e.latLng.lat(), e.latLng.lng());
            },
            dragend: function(e) {
                console.log('Map drag ended');
            }
        });

        // Add a marker that shows coordinates when clicked
        map8.addMarker({
            lat: -12.043333,
            lng: -77.028333,
            title: 'Click me!',
            click: function(e) {
                alert(`Marker position: ${e.position.lat()}, ${e.position.lng()}`);
            }
        });
    }
};

// Set up the callback for Google Maps API
window.initializeMaps = window.initializeMaps || function() {
    console.warn('Google Maps API not loaded yet');
};

// Initialize when DOM is ready and Google Maps is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.google && window.google.maps) {
            window.initializeMaps();
        }
    });
} else {
    if (window.google && window.google.maps) {
        window.initializeMaps();
    }
}