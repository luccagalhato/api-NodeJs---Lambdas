import { LatLon } from 'geolocation-utils';

// Calculate de distance between two coordinates - return is in Meter!
export function calcDistance(p1: LatLon, p2: LatLon) {

  const R = 6371;
  const dLat = deg2rad(p2.lat - p1.lat);
  const dLng = deg2rad(p2.lon - p1.lon);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p1.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(5)) * 1000;

}

const deg2rad = function (deg) {
  return deg * (Math.PI / 180);
}
