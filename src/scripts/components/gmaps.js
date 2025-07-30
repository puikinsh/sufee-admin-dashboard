// Google Maps component using native Google Maps JavaScript API
// No jQuery or external dependencies required

class GoogleMapsManager {
    constructor() {
        this.maps = {};
        this.markers = {};
    }

    // Initialize all maps when the API is ready
    initialize() {
        // Basic Map
        this.initBasicMap();
        
        // Map with Markers
        this.initMarkersMap();
        
        // Geometry Overlays Map
        this.initGeometryMap();
        
        // Elevation Map
        this.initElevationMap();
        
        // Geolocation Map
        this.initGeolocationMap();
        
        // Styled Map
        this.initStyledMap();
        
        // Traffic Layer Map
        this.initTrafficMap();
        
        // Map Events
        this.initEventsMap();
    }

    // Basic Map
    initBasicMap() {
        const element = document.getElementById('basic-map');
        if (!element) return;

        this.maps.basic = new google.maps.Map(element, {
            center: { lat: -12.043333, lng: -77.028333 },
            zoom: 8,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });
    }

    // Map with Markers
    initMarkersMap() {
        const element = document.getElementById('map-2');
        if (!element) return;

        this.maps.markers = new google.maps.Map(element, {
            center: { lat: 41.850033, lng: -87.6500523 },
            zoom: 11
        });

        // Add some example markers
        const locations = [
            { lat: 41.850033, lng: -87.6500523, title: 'Chicago' },
            { lat: 41.881832, lng: -87.623177, title: 'Willis Tower' },
            { lat: 41.878876, lng: -87.635918, title: 'Millennium Park' }
        ];

        this.markers.markers = locations.map(location => {
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: this.maps.markers,
                title: location.title,
                animation: google.maps.Animation.DROP
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<div class="p-2"><h6>${location.title}</h6><p>Click for more info</p></div>`
            });

            marker.addListener('click', () => {
                infoWindow.open(this.maps.markers, marker);
            });

            return marker;
        });
    }

    // Geometry Overlays Map
    initGeometryMap() {
        const element = document.getElementById('map-3');
        if (!element) return;

        this.maps.geometry = new google.maps.Map(element, {
            center: { lat: -12.040397656836609, lng: -77.03373871559225 },
            zoom: 14
        });

        // Rectangle
        const rectangle = new google.maps.Rectangle({
            strokeColor: '#0d6efd',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0d6efd',
            fillOpacity: 0.35,
            map: this.maps.geometry,
            bounds: {
                north: -12.030397656836609,
                south: -12.034804866577001,
                east: -77.01154422636042,
                west: -77.02373871559225
            }
        });

        // Polygon
        const triangleCoords = [
            { lat: -12.040397656836609, lng: -77.03373871559225 },
            { lat: -12.040248585302038, lng: -77.03993927003302 },
            { lat: -12.050047116528843, lng: -77.02448169303511 },
            { lat: -12.044804866577001, lng: -77.02154422636042 }
        ];

        const polygon = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#198754',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#198754',
            fillOpacity: 0.35,
            map: this.maps.geometry
        });

        // Circle
        const circle = new google.maps.Circle({
            strokeColor: '#6f42c1',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#6f42c1',
            fillOpacity: 0.35,
            map: this.maps.geometry,
            center: { lat: -12.040504866577001, lng: -77.02024422636042 },
            radius: 350
        });

        // Fit bounds to show all shapes
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: -12.030397656836609, lng: -77.03993927003302 });
        bounds.extend({ lat: -12.050047116528843, lng: -77.01154422636042 });
        this.maps.geometry.fitBounds(bounds);
    }

    // Elevation Map
    initElevationMap() {
        const element = document.getElementById('map-4');
        if (!element) return;

        this.maps.elevation = new google.maps.Map(element, {
            center: { lat: -12.043333, lng: -77.028333 },
            zoom: 13
        });

        const elevator = new google.maps.ElevationService();
        const locations = [
            { lat: -12.040397656836609, lng: -77.03373871559225 },
            { lat: -12.050047116528843, lng: -77.02448169303511 },
            { lat: -12.044804866577001, lng: -77.02154422636042 }
        ];

        // Request elevation data
        elevator.getElevationForLocations({
            locations: locations
        }, (results, status) => {
            if (status === 'OK' && results) {
                results.forEach((result, index) => {
                    const marker = new google.maps.Marker({
                        position: result.location,
                        map: this.maps.elevation,
                        title: `Elevation: ${result.elevation.toFixed(2)} meters`
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div class="p-2">
                            <h6>Location ${index + 1}</h6>
                            <p>Elevation: <strong>${result.elevation.toFixed(2)}</strong> meters</p>
                        </div>`
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(this.maps.elevation, marker);
                    });
                });
            }
        });
    }

    // Geolocation Map
    initGeolocationMap() {
        const element = document.getElementById('map-5');
        if (!element) return;

        this.maps.geolocation = new google.maps.Map(element, {
            center: { lat: -12.043333, lng: -77.028333 },
            zoom: 6
        });

        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    this.maps.geolocation.setCenter(pos);
                    this.maps.geolocation.setZoom(15);

                    new google.maps.Marker({
                        position: pos,
                        map: this.maps.geolocation,
                        title: 'Your Location',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#0d6efd',
                            fillOpacity: 0.8,
                            strokeColor: '#fff',
                            strokeWeight: 2
                        }
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: '<div class="p-2"><h6>You are here!</h6></div>'
                    });
                    
                    infoWindow.setPosition(pos);
                    infoWindow.open(this.maps.geolocation);
                },
                () => {
                    this.handleLocationError(true, this.maps.geolocation.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, this.maps.geolocation.getCenter());
        }
    }

    handleLocationError(browserHasGeolocation, pos) {
        const infoWindow = new google.maps.InfoWindow({
            content: browserHasGeolocation
                ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.'
        });
        infoWindow.setPosition(pos);
        infoWindow.open(this.maps.geolocation);
    }

    // Styled Map
    initStyledMap() {
        const element = document.getElementById('map-6');
        if (!element) return;

        // Night mode style
        const nightStyle = [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
            }
        ];

        this.maps.styled = new google.maps.Map(element, {
            center: { lat: 40.65, lng: -73.95 },
            zoom: 12,
            styles: nightStyle
        });
    }

    // Traffic Layer Map
    initTrafficMap() {
        const element = document.getElementById('map-7');
        if (!element) return;

        this.maps.traffic = new google.maps.Map(element, {
            center: { lat: 34.04924594193164, lng: -118.24104309082031 },
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        const trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(this.maps.traffic);

        const transitLayer = new google.maps.TransitLayer();
        transitLayer.setMap(this.maps.traffic);
    }

    // Map Events
    initEventsMap() {
        const element = document.getElementById('map-8');
        if (!element) return;

        this.maps.events = new google.maps.Map(element, {
            center: { lat: -12.043333, lng: -77.028333 },
            zoom: 16
        });

        // Click event
        this.maps.events.addListener('click', (e) => {
            const marker = new google.maps.Marker({
                position: e.latLng,
                map: this.maps.events,
                animation: google.maps.Animation.DROP
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<div class="p-2">
                    <h6>You clicked here!</h6>
                    <p>Lat: ${e.latLng.lat().toFixed(6)}</p>
                    <p>Lng: ${e.latLng.lng().toFixed(6)}</p>
                </div>`
            });

            marker.addListener('click', () => {
                infoWindow.open(this.maps.events, marker);
            });
        });

        // Add instructions
        const controlDiv = document.createElement('div');
        controlDiv.className = 'bg-white border rounded shadow-sm m-2 p-2';
        controlDiv.innerHTML = '<small>Click anywhere on the map to place a marker</small>';
        this.maps.events.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }
}

// Create global instance
window.googleMapsManager = new GoogleMapsManager();

// Initialize when Google Maps is loaded
window.initGoogleMaps = function() {
    window.googleMapsManager.initialize();
};

// Export for module usage
export default GoogleMapsManager;