import { useTheme } from '@polito/lib/ui';
import { Symbol } from '@polito/student-api-client';

export const useSymbolColor = (symbol?: Symbol) => {
  const { dark, palettes } = useTheme();

  if (!symbol?.color) {
    return palettes.gray[dark ? 400 : 500];
  }

  return dark ? symbol.color.dark : symbol.color.light;
};
