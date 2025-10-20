import { JSX, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { Tab } from '../../ui/components/Tab';
import { Tabs } from '../../ui/components/Tabs';
import { useTheme } from '../../ui/hooks/useTheme';

interface TabOptions {
  title: string;
  renderContent: () => JSX.Element;
}

export const useTabs = (options: TabOptions[]) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [mountedTabs, setMountedTabs] = useState<number[]>([0]); // Salva gli indici dei tab visitati
  const { colors } = useTheme();

  useEffect(() => {
    if (!mountedTabs.includes(selectedTabIndex)) {
      setMountedTabs([...mountedTabs, selectedTabIndex]);
    }
  }, [selectedTabIndex]);

  const TabsComponent = useMemo(
    () => () => (
      <Tabs
        selectedIndexes={[selectedTabIndex]}
        style={{
          backgroundColor: colors.surface,
          borderBottomWidth: Platform.select({
            ios: StyleSheet.hairlineWidth,
          }),
          borderBottomColor: colors.divider,
          elevation: 3,
          zIndex: 1,
        }}
      >
        {options.map((o, i) => (
          <Tab key={i} onPress={() => setSelectedTabIndex(i)}>
            {o.title}
          </Tab>
        ))}
      </Tabs>
    ),
    [options, selectedTabIndex],
  );

  const TabsContent = useMemo(
    () =>
      mountedTabs.includes(selectedTabIndex)
        ? options[selectedTabIndex].renderContent
        : () => null, // Evita di rimuovere il componente
    [options, selectedTabIndex, mountedTabs],
  );

  return {
    selectedTabIndex,
    Tabs: TabsComponent,
    TabsContent,
  };
};
