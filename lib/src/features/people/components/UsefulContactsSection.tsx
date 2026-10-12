import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import { faUser } from '@fortawesome/free-regular-svg-icons';

import { Icon } from '../../../ui/components/Icon';
import { IndentedDivider } from '../../../ui/components/IndentedDivider';
import { ListItem } from '../../../ui/components/ListItem';
import { Row } from '../../../ui/components/Row';
import { Text } from '../../../ui/components/Text';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { UsefulContact } from '../types';

interface Props {
  contacts: UsefulContact[];
}

export const UsefulContactsSection = ({ contacts }: Props) => {
  const { t } = useTranslation();
  const { dark, palettes, colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  if (!contacts.length) {
    return null;
  }

  const infoColor = dark ? palettes.info[400] : palettes.info[700];

  return (
    <View style={styles.container}>
      <Row align="center" justify="space-between" style={styles.header}>
        <Text style={[styles.heading, { color: infoColor }]} variant="heading">
          {t('contactsScreen.usefulContacts')}
        </Text>
      </Row>
      <View style={styles.list}>
        {contacts.map((contact, index) => {
          const isFirst = index === 0;
          const isLast = index === contacts.length - 1;
          return (
            <View key={contact.id}>
              {!isFirst && <IndentedDivider indent={20} />}
              <ListItem
                title={contact.title}
                linkTo={{ screen: 'UsefulContact', params: { id: contact.id } }}
                leadingItem={<Icon icon={faUser} size={fontSizes.xl} />}
                containerStyle={{
                  backgroundColor: colors.surface,
                }}
                style={[isFirst && styles.firstItem, isLast && styles.lastItem]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = ({ shapes, spacing, colors }: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: Platform.select({ ios: spacing[4] }),
    },
    header: {
      marginTop: spacing[5],
      marginBottom: spacing[2],
      paddingHorizontal: Platform.select({ android: spacing[3] }),
    },
    heading: { padding: spacing[1] },
    list: {
      backgroundColor: colors.surface,
      borderRadius: Platform.select({ ios: shapes.lg, android: 0 }),
      overflow: 'hidden',
    },
    firstItem: {
      borderTopLeftRadius: Platform.select({ ios: shapes.lg }),
      borderTopRightRadius: Platform.select({ ios: shapes.lg }),
    },
    lastItem: {
      borderBottomLeftRadius: Platform.select({ ios: shapes.lg }),
      borderBottomRightRadius: Platform.select({ ios: shapes.lg }),
    },
  });
