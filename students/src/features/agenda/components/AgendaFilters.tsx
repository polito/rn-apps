import { Tabs } from '@polito/lib/ui';

import { AgendaTypeFilter } from './AgendaTypeFilter';

export const AgendaFilters = () => {
  return (
    <Tabs>
      <AgendaTypeFilter />
    </Tabs>
  );
};
