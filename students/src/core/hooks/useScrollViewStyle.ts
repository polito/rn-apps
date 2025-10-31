import { IS_IOS } from '@lib/core/constants';
import { useHeaderHeight } from '@react-navigation/elements';

export const useScrollViewStyle = () => {
  const headerHeight = useHeaderHeight();

  return {
    paddingTop: IS_IOS ? headerHeight : undefined,
  };
};
