import { useMemo } from 'react';

import { useTheme } from '@polito/lib/ui';
import { StudentCareerStatusEnum } from '@polito/student-api-client';

export const useCareerStatusColors = (status: StudentCareerStatusEnum) => {
  const { dark, palettes } = useTheme();

  return useMemo(() => {
    switch (status) {
      case StudentCareerStatusEnum.Active:
        return [palettes.success[dark ? 300 : 600], palettes.success[500]];
      case StudentCareerStatusEnum.Closed:
      case StudentCareerStatusEnum.Cancelled:
      case StudentCareerStatusEnum.CareerClosed:
        return [palettes.danger[dark ? 400 : 600], palettes.danger[600]];
      case StudentCareerStatusEnum.Graduated:
        return [
          palettes.primary[dark ? 300 : 600],
          palettes.primary[dark ? 400 : 500],
        ];
      default:
        return [palettes.gray[dark ? 400 : 500], palettes.gray[500]];
    }
  }, [dark, palettes, status]);
};
