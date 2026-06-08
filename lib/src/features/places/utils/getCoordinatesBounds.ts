import { CameraStop } from '@rnmapbox/maps';

export const getCoordinatesBounds = (
  coordinates: [number, number][],
): NonNullable<CameraStop['bounds']> => {
  const lons = coordinates.map(([l]) => l);
  const lats = coordinates.map(([_, l]) => l);

  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const lonPadding = Math.max((maxLon - minLon) * 0.15, 0.00025);
  const latPadding = Math.max((maxLat - minLat) * 0.15, 0.00025);

  return {
    ne: [maxLon + lonPadding, maxLat + latPadding],
    sw: [minLon - lonPadding, minLat - latPadding],
  };
};
