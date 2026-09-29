import { Fragment } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { BottomBarSpacer } from '../../../ui/components/BottomBarSpacer';
import { Card } from '../../../ui/components/Card';
import { Icon } from '../../../ui/components/Icon';
import { InfoMessage } from '../../../ui/components/InfoMessage';
import { ListItem } from '../../../ui/components/ListItem';
import { OverviewList } from '../../../ui/components/OverviewList';
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
    const { kind, target } = contact.action;
    const url =
      kind === 'email'
        ? `mailto:${target}`
        : kind === 'tel'
          ? `tel:${target}`
          : target;
    if (!url) return;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scroll}
    >
      <View style={styles.content}>
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
                variant="heading"
                style={[styles.infoTitle, { fontSize: fontSizes.sm }]}
              >
                {detail.info.title}
              </Text>
              {detail.info.body}
            </View>
          </Card>
        )}

        {detail.contacts.length > 0 && (
          <OverviewList indented style={styles.contactsCard}>
            {detail.contacts.map((contact, index) => (
              <ListItem
                key={index}
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
            ))}
          </OverviewList>
        )}
      </View>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ spacing, shapes }: Theme) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 1,
    },
    content: {
      padding: spacing[5],
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
      padding: spacing[3],
      gap: spacing[1],
    },
    infoTitle: {
      marginBottom: spacing[1],
    },
    contactsCard: {
      marginHorizontal: 0,
      marginVertical: 0,
      borderRadius: Platform.select({ ios: shapes.md }),
    },
  });
