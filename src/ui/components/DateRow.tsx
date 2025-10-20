import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { faCalendar } from '@fortawesome/free-solid-svg-icons';

import { Card } from './Card';
import { IconButton } from './IconButton';
import { Row } from './Row';
import { Text } from './Text';

export const DateRow = ({
  label,
  date,
  onPressCalendar,
  onClear,
}: {
  label: string;
  date: string | null;
  onPressCalendar: () => void;
  onClear?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Card style={{ marginHorizontal: 16, marginVertical: 8, borderRadius: 12 }}>
      <Row justify="space-between" align="center">
        <Text style={{ marginLeft: 10 }}>
          {label}: {date || t('other.never')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {date && onClear && (
            <TouchableOpacity onPress={onClear} style={{ marginRight: 12 }}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          )}

          <IconButton icon={faCalendar} size={20} onPress={onPressCalendar} />
        </View>
      </Row>
    </Card>
  );
};
