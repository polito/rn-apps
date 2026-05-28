import { Fragment } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Card } from '../../../ui/components/Card';
import { Icon } from '../../../ui/components/Icon';
import { IndentedDivider } from '../../../ui/components/IndentedDivider';
import { InfoMessage } from '../../../ui/components/InfoMessage';
import { ListItem } from '../../../ui/components/ListItem';
import { Text } from '../../../ui/components/Text';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { UsefulContactDetail, UsefulContactItem } from '../types';

interface Props {
  detail: UsefulContactDetail;
}

export const StaticContactScreenContent = ({ detail }: Props) => {
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();

  const openContact = (contact: UsefulContactItem) => {
    const url =
      contact.action.kind === 'email'
        ? `mailto:${contact.action.target}`
        : `tel:${contact.action.target}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scroll}
    >
      <Text variant="heading" style={styles.title}>
        {detail.title}
      </Text>

      <Card style={styles.descriptionCard} padded={false}>
        <View style={styles.descriptionInner}>
          {detail.description.paragraphs.map((paragraph, index) => (
            <Fragment key={index}>{paragraph}</Fragment>
          ))}
          {detail.description.warning && (
            <InfoMessage variant="warning">
              {detail.description.warning}
            </InfoMessage>
          )}
        </View>
      </Card>

      {detail.info && (
        <Card style={styles.infoCard} padded={false}>
          <View style={styles.infoInner}>
            <Text
              variant="title"
              weight="semibold"
              style={[styles.infoTitle, { color: colors.heading }]}
            >
              {detail.info.title}
            </Text>
            {detail.info.body}
          </View>
        </Card>
      )}

      {detail.contacts.length > 0 && (
        <Card style={styles.contactsCard} padded={false}>
          {detail.contacts.map((contact, index) => (
            <View key={index}>
              {index > 0 && <IndentedDivider indent={20} />}
              <ListItem
                title={contact.title}
                subtitle={contact.value}
                onPress={() => openContact(contact)}
                accessibilityRole="button"
                leadingItem={<Icon icon={contact.icon} size={fontSizes.lg} />}
                trailingItem={
                  <Icon
                    icon={faChevronRight}
                    color={colors.secondaryText}
                    size={fontSizes.sm}
                  />
                }
              />
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
};

const createStyles = ({ spacing, shapes }: Theme) =>
  StyleSheet.create({
    scroll: {
      padding: spacing[4],
      gap: spacing[3],
    },
    title: {
      marginTop: spacing[1],
      marginBottom: spacing[2],
    },
    descriptionCard: {
      marginHorizontal: 0,
      borderRadius: shapes.md,
    },
    descriptionInner: {
      padding: spacing[3],
      gap: spacing[3],
    },
    infoCard: {
      marginHorizontal: 0,
      borderRadius: shapes.md,
    },
    infoInner: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2.5],
      gap: spacing[1],
    },
    infoTitle: {
      marginBottom: spacing[1],
    },
    contactsCard: Platform.select({
      ios: { marginHorizontal: 0, borderRadius: shapes.md },
      android: { marginHorizontal: 0 },
    })!,
  });
