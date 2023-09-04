import mapboxgl from 'mapbox-gl';

export const displayMap = (locations: any) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZG9zYW5qb3NndXN0YXZvIiwiYSI6ImNsbHBmbm15NTA1NWIza2xpMWo4bDlwcTIifQ.vPBJ5o4Txtu9VMAUIjggcQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dosanjosgustavo/cllv02m31012101qx0uq49ct5',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc: any) => {
    const element = document.createElement('div');
    element.className = 'marker';

    new mapboxgl.Marker({
      element,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
