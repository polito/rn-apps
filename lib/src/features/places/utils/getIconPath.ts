import { Floor, NavigationResponseFeature } from '@polito/student-api-client';

export const getIcon = (
  index: number,
  floorMapNames: Floor[],
  pathFeatureCollection: NavigationResponseFeature[],
) => {
  if (index >= pathFeatureCollection.length - 1) return 'destination';

  const currentFloor = floorMapNames?.find(
    floor =>
      floor.id === pathFeatureCollection[index].features.properties.fn_fl_id,
  );
  const nextFloor = floorMapNames?.find(
    floor =>
      floor.id ===
      pathFeatureCollection[index + 1].features.properties.fn_fl_id,
  );

  if (currentFloor && nextFloor) {
    return currentFloor.level > nextFloor.level
      ? 'down'
      : pathFeatureCollection[index + 1].isPrivate
        ? 'private_access'
        : 'up';
  }

  return 'unknown';
};
