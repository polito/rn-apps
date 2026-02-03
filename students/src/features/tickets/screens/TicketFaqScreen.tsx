import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { BottomBarSpacer } from '@polito/lib';
import { CtaButton } from '@polito/lib';
import { HtmlView } from '@polito/lib';
import { Section } from '@polito/lib';
import { SectionHeader } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';
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

        <CtaButton
          absolute={false}
          title={t('ticketFaqsScreen.writeTicket')}
          hint={t('ticketFaqsScreen.noResultFound')}
          action={() =>
            navigation.navigate('CreateTicket', {
              subtopicId: undefined,
              topicId: undefined,
            })
          }
          icon={faPencil}
        />

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
  });
