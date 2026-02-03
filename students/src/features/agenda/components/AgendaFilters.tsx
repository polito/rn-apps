import { Tabs } from '@polito/lib';

import { AgendaTypeFilter } from './AgendaTypeFilter';

export const AgendaFilters = () => {
  return (
    <Tabs>
      <AgendaTypeFilter />
    </Tabs>
  );
};
