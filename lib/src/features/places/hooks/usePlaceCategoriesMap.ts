// TODO(map-api): Import this model from @polito/map-client when available.
import { PlaceCategory } from '@polito/api-client';

import { useGetPlaceCategories } from '../queries/placesHooks';

export const usePlaceCategoriesMap = () => {
  const { data: categories } = useGetPlaceCategories();
  if (!categories) {
    return null;
  }
  return categories.data
    .concat(categories.data.flatMap(c => c.subCategories ?? []))
    .reduce<Record<PlaceCategory['id'], PlaceCategory>>((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {});
};
