import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  HtmlView,
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';

type Props = NativeStackScreenProps<ServiceStackParamList, 'TicketFaq'>;

export const TicketFaqScreen = ({ route, navigation }: Props) => {
  const { faq } = route.params;
  const { t } = useTranslation();

  const styles = useStylesheet(createStyles);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <SafeAreaView>
        <Section>
          <SectionHeader title={faq.question} ellipsizeTitle={false} />
          <HtmlView
            props={{ source: { html: faq.answer } }}
            variant="longProse"
          />
        </Section>

        <OverviewList indented style={styles.writeTicketList}>
          <ListItem
            inverted
            isAction
            leadingItem={<Icon icon={faCircleQuestion} size={20} />}
            title={t('ticketFaqsScreen.writeTicket')}
            subtitle={t('ticketFaqsScreen.stillNeedHelp')}
            accessibilityRole="button"
            accessibilityLabel={[
              t('ticketFaqsScreen.stillNeedHelp'),
              t('ticketFaqsScreen.writeTicket'),
            ].join(', ')}
            onPress={() =>
              navigation.navigate('CreateTicket', {
                subtopicId: undefined,
                topicId: undefined,
              })
            }
          />
        </OverviewList>

        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    writeTicketList: {
      marginTop: spacing[4],
    },
  });
