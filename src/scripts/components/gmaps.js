// Google Maps examples (maps-gmap.html)
//
// Add your Google Maps API key in src/config/maps.config.js. Until then each
// map shows a static preview: an SVG drawn from Natural Earth data (public
// domain) with the same markers and overlays the live map shows, plus a short
// notice. With a key, the Maps JavaScript API is loaded through Google's
// official loader (@googlemaps/js-api-loader) and every example is drawn as
// an interactive map.
//
// Each example is a container with a data-gmap attribute:
//   <div class="gmap" id="basic-map" data-gmap="basic" style="height: 400px"></div>
// `data-gmap` picks the builder below and the preview in src/images/maps/.

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import mapsConfig from '../../config/maps.config.js';
import basicPreview from '../../images/maps/basic.svg?raw';
import markersPreview from '../../images/maps/markers.svg?raw';
import geometryPreview from '../../images/maps/geometry.svg?raw';
import elevationPreview from '../../images/maps/elevation.svg?raw';
import geolocationPreview from '../../images/maps/geolocation.svg?raw';
import styledPreview from '../../images/maps/styled.svg?raw';
import trafficPreview from '../../images/maps/traffic.svg?raw';
import eventsPreview from '../../images/maps/events.svg?raw';

const CONFIG_FILE = 'src/config/maps.config.js';

const PREVIEWS = {
  basic: basicPreview,
  markers: markersPreview,
  geometry: geometryPreview,
  elevation: elevationPreview,
  geolocation: geolocationPreview,
  styled: styledPreview,
  traffic: trafficPreview,
  events: eventsPreview
};

const LIMA = { lat: -12.043333, lng: -77.028333 };

const NOTICES = {
  preview: `<strong>Preview</strong> — add your Google Maps API key in <code>${CONFIG_FILE}</code> to load the interactive map`,
  rejected: `<strong>Preview</strong> — Google Maps rejected the API key in <code>${CONFIG_FILE}</code>. Check the key and its allowed referrers.`,
  failed: `<strong>Preview</strong> — Google Maps could not be loaded. Check your connection and the key in <code>${CONFIG_FILE}</code>.`
};

// Night mode style for the styled-map example
const NIGHT_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
];

export class GoogleMapsManager {
  constructor() {
    this.containers = [...document.querySelectorAll('[data-gmap]')];
    this.maps = {};
    if (!this.containers.length) {
      return;
    }

    const key = String(mapsConfig.googleMapsApiKey || '').trim();
    if (!key) {
      this.showPreviews(NOTICES.preview);
      return;
    }

    // Called by the Maps JavaScript API when it rejects the key.
    window.gm_authFailure = () => this.showPreviews(NOTICES.rejected);

    this.loadLiveMaps(key).catch(() => this.showPreviews(NOTICES.failed));
  }

  // ---------------------------------------------------------------------------
  // Static previews
  // ---------------------------------------------------------------------------

  showPreviews(message) {
    this.containers.forEach(container => {
      const svg = PREVIEWS[container.dataset.gmap];
      if (!svg) {
        return;
      }
      container.querySelectorAll('.gmap-preview-svg, .gmap-notice').forEach(node => node.remove());
      // A map that failed to authenticate stays in the DOM (the Maps API still
      // references it) but is hidden behind the preview.
      const canvas = container.querySelector('.gmap-canvas');
      if (canvas) {
        canvas.hidden = true;
      }
      container.insertAdjacentHTML(
        'beforeend',
        `${svg}<div class="gmap-notice"><i class="fas fa-circle-info" aria-hidden="true"></i><span>${message}</span></div>`
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Live Google Maps
  // ---------------------------------------------------------------------------

  async loadLiveMaps(key) {
    setOptions({ key, v: 'weekly' });
    const [maps, marker, core, elevation] = await Promise.all([
      importLibrary('maps'),
      importLibrary('marker'),
      importLibrary('core'),
      importLibrary('elevation')
    ]);
    this.lib = { ...maps, ...marker, ...core, ...elevation };

    this.containers.forEach(container => {
      const build = this.builders[container.dataset.gmap];
      if (!build) {
        return;
      }
      container.innerHTML = '';
      const canvas = document.createElement('div');
      canvas.className = 'gmap-canvas';
      container.appendChild(canvas);
      build.call(this, canvas);
    });
  }

  get mapId() {
    return mapsConfig.googleMapsMapId || 'DEMO_MAP_ID';
  }

  // Marker with an info window that opens on click
  addMarker(map, position, title, content) {
    const { AdvancedMarkerElement, InfoWindow } = this.lib;
    const marker = new AdvancedMarkerElement({ map, position, title });
    if (content) {
      const infoWindow = new InfoWindow({ content });
      marker.addEventListener('gmp-click', () => infoWindow.open({ anchor: marker, map }));
    }
    return marker;
  }

  builders = {
    // Basic map
    basic(element) {
      const { Map, ControlPosition } = this.lib;
      this.maps.basic = new Map(element, {
        center: LIMA,
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: { position: ControlPosition.LEFT_TOP }
      });
    },

    // Map with markers
    markers(element) {
      const { Map } = this.lib;
      const map = new Map(element, {
        center: { lat: 41.850033, lng: -87.6500523 },
        zoom: 11,
        mapId: this.mapId
      });
      this.maps.markers = map;

      const locations = [
        { lat: 41.850033, lng: -87.6500523, title: 'Chicago' },
        { lat: 41.878876, lng: -87.635918, title: 'Willis Tower' },
        { lat: 41.881832, lng: -87.623177, title: 'Millennium Park' }
      ];
      locations.forEach(({ lat, lng, title }) => {
        this.addMarker(
          map,
          { lat, lng },
          title,
          `<div class="p-2"><h6>${title}</h6><p class="mb-0">Click for more info</p></div>`
        );
      });
    },

    // Geometry overlays: rectangle, polygon and circle
    geometry(element) {
      const { Map, Rectangle, Polygon, Circle, LatLngBounds } = this.lib;
      const map = new Map(element, {
        center: { lat: -12.040397656836609, lng: -77.03373871559225 },
        zoom: 14
      });
      this.maps.geometry = map;

      new Rectangle({
        strokeColor: '#0d6efd',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0d6efd',
        fillOpacity: 0.35,
        map,
        bounds: { north: -12.030398, south: -12.034805, east: -77.011544, west: -77.023739 }
      });

      new Polygon({
        paths: [
          { lat: -12.040398, lng: -77.033739 },
          { lat: -12.040249, lng: -77.039939 },
          { lat: -12.050047, lng: -77.024482 },
          { lat: -12.044805, lng: -77.021544 }
        ],
        strokeColor: '#198754',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#198754',
        fillOpacity: 0.35,
        map
      });

      new Circle({
        strokeColor: '#6f42c1',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#6f42c1',
        fillOpacity: 0.35,
        map,
        center: { lat: -12.040505, lng: -77.020244 },
        radius: 350
      });

      // Fit bounds to show all shapes
      const bounds = new LatLngBounds();
      bounds.extend({ lat: -12.030398, lng: -77.039939 });
      bounds.extend({ lat: -12.050047, lng: -77.011544 });
      map.fitBounds(bounds);
    },

    // Elevation of three locations (needs the Elevation API enabled for the key)
    elevation(element) {
      const { Map, AdvancedMarkerElement, InfoWindow, ElevationService } = this.lib;
      const map = new Map(element, { center: LIMA, zoom: 13, mapId: this.mapId });
      this.maps.elevation = map;

      const locations = [
        { lat: -12.040397656836609, lng: -77.03373871559225 },
        { lat: -12.050047116528843, lng: -77.02448169303511 },
        { lat: -12.044804866577001, lng: -77.02154422636042 }
      ];
      const content = (index, text) =>
        `<div class="p-2"><h6>Location ${index + 1}</h6><p class="mb-0">${text}</p></div>`;

      // The elevations are requested on the first marker click, so the page
      // makes no Elevation API calls until someone asks for one.
      let elevations = null;
      const loadElevations = () => {
        elevations ??= new ElevationService()
          .getElevationForLocations({ locations })
          .then(({ results }) => results.map(result => result.elevation))
          .catch(() => []);
        return elevations;
      };

      locations.forEach((position, index) => {
        const marker = new AdvancedMarkerElement({ map, position, title: `Location ${index + 1}` });
        const infoWindow = new InfoWindow({ content: content(index, 'Loading elevation…') });
        marker.addEventListener('gmp-click', async () => {
          infoWindow.open({ anchor: marker, map });
          const elevation = (await loadElevations())[index];
          infoWindow.setContent(
            content(
              index,
              typeof elevation === 'number'
                ? `Elevation: <strong>${elevation.toFixed(2)}</strong> meters`
                : 'Elevation unavailable: enable the Elevation API for your key'
            )
          );
        });
      });
    },

    // Browser geolocation
    geolocation(element) {
      const { Map, AdvancedMarkerElement, InfoWindow } = this.lib;
      const map = new Map(element, { center: LIMA, zoom: 6, mapId: this.mapId });
      this.maps.geolocation = map;

      const showMessage = (content, position) => {
        const infoWindow = new InfoWindow({ content, position });
        infoWindow.open(map);
      };

      if (!navigator.geolocation) {
        showMessage("Error: Your browser doesn't support geolocation.", map.getCenter());
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const position = { lat: coords.latitude, lng: coords.longitude };
          map.setCenter(position);
          map.setZoom(15);

          const dot = document.createElement('div');
          dot.style.cssText =
            'width:20px;height:20px;border-radius:50%;background:rgba(13,110,253,.8);border:2px solid #fff;box-shadow:0 0 0 8px rgba(13,110,253,.15)';
          new AdvancedMarkerElement({ map, position, title: 'Your Location', content: dot });
          showMessage('<div class="p-2"><h6 class="mb-0">You are here!</h6></div>', position);
        },
        () => showMessage('Error: The Geolocation service failed.', map.getCenter())
      );
    },

    // Styled map (night mode)
    styled(element) {
      const { Map } = this.lib;
      this.maps.styled = new Map(element, {
        center: { lat: 40.65, lng: -73.95 },
        zoom: 12,
        styles: NIGHT_STYLE
      });
    },

    // Traffic and transit layers
    traffic(element) {
      const { Map, TrafficLayer, TransitLayer } = this.lib;
      const map = new Map(element, {
        center: { lat: 34.04924594193164, lng: -118.24104309082031 },
        zoom: 13,
        mapTypeId: 'roadmap'
      });
      this.maps.traffic = map;
      new TrafficLayer().setMap(map);
      new TransitLayer().setMap(map);
    },

    // Map events: click to place a marker
    events(element) {
      const { Map, InfoWindow, ControlPosition } = this.lib;
      const map = new Map(element, { center: LIMA, zoom: 16, mapId: this.mapId });
      this.maps.events = map;

      map.addListener('click', event => {
        const lat = event.latLng.lat().toFixed(6);
        const lng = event.latLng.lng().toFixed(6);
        const marker = this.addMarker(map, event.latLng, 'Clicked location');
        const infoWindow = new InfoWindow({
          content: `<div class="p-2"><h6>You clicked here!</h6><p class="mb-0">Lat: ${lat}<br>Lng: ${lng}</p></div>`
        });
        marker.addEventListener('gmp-click', () => infoWindow.open({ anchor: marker, map }));
      });

      const controlDiv = document.createElement('div');
      controlDiv.className = 'bg-white text-dark border rounded shadow-sm m-2 p-2';
      controlDiv.innerHTML = '<small>Click anywhere on the map to place a marker</small>';
      map.controls[ControlPosition.TOP_CENTER].push(controlDiv);
    }
  };
}

export default GoogleMapsManager;
