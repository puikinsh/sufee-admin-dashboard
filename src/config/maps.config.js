// Google Maps configuration
//
// The Google Maps page (maps-gmap.html) shows a static preview of each map
// until you add your own Google Maps API key here. With a key, the same
// examples load as interactive Google Maps. Rebuild (npm run build) after
// changing it.
//
//  1. Create a key: https://developers.google.com/maps/documentation/javascript/get-api-key
//     and enable the "Maps JavaScript API" for its project (the elevation
//     example also uses the "Elevation API").
//  2. Restrict the key to your site's HTTP referrers. Like every browser-side
//     key, it is visible in the page source.
//  3. Paste it below. Don't commit a real key to a public repository.

export default {
  googleMapsApiKey: '',

  // Map ID for the examples with markers (Advanced Markers need one).
  // 'DEMO_MAP_ID' is Google's shared ID for development; create your own Map
  // ID in the Google Cloud console for production.
  googleMapsMapId: 'DEMO_MAP_ID'
};
