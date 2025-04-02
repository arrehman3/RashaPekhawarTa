import L from 'leaflet';

const BRT_STOPS = [
  { name: 'Chamkani', coords: [34.0151, 71.5849] },
  { name: 'Hashtnagri', coords: [34.0080, 71.5786] },
  { name: 'Khyber Bazaar', coords: [34.0066, 71.5732] },
  { name: 'Mall Road', coords: [34.0025, 71.5677] },
  { name: 'University Road', coords: [33.9989, 71.4855] },
  { name: 'Hayatabad', coords: [33.9897, 71.4595] }
];

export function initializeMap(containerId) {
  const map = L.map(containerId).setView([34.0151, 71.5849], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add BRT route line
  const routeCoords = BRT_STOPS.map(stop => stop.coords);
  L.polyline(routeCoords, { color: 'red', weight: 4 }).addTo(map);

  // Add markers for each stop
  BRT_STOPS.forEach(stop => {
    L.marker(stop.coords)
      .bindPopup(stop.name)
      .addTo(map);
  });

  return map;
}