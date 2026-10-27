import { useTranslation } from 'react-i18next';

import { Tab, Tabs } from '@polito/lib/ui';

import { ExamStudentFilter } from '../types/exams';

type Props = {
  filters: ExamStudentFilter[];
  value: ExamStudentFilter;
  onChange: (filter: ExamStudentFilter) => void;
};

export const ExamStudentFilters = ({ filters, value, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <Tabs>
      {filters.map(filter => (
        <Tab
          key={filter}
          selected={filter === value}
          onPress={() => onChange(filter)}
        >
          {t(`examStudentsList.filters.${filter}`)}
        </Tab>
      ))}
    </Tabs>
  );
};
