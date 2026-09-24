import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import {
  faEnvelope,
  faLink,
  faPhone,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

import { Text } from '../../../ui/components/Text';
import { UsefulContact, UsefulContactDetail } from '../types';

export const CONSIGLIERA_FIDUCIA_ID = 'consigliera-fiducia';
export const SPORTELLO_ANTIVIOLENZA_ID = 'sportello-antiviolenza';
export const GARANTE_STUDENTI_ID = 'garante-studenti';

const GARANTE_STUDENTI_URL =
  'https://www.polito.it/didattica/servizi-e-vita-al-politecnico/accoglienza-inclusione-e-sostegno/garante-studenti';

const CONSIGLIERA_FIDUCIA_KEY = 'usefulContacts.consiglieraFiducia';
const SPORTELLO_ANTIVIOLENZA_KEY = 'usefulContacts.sportelloAntiviolenza';
const GARANTE_STUDENTI_KEY = 'usefulContacts.garanteStudenti';

export const defaultUsefulContactsList: UsefulContact[] = [
  { id: CONSIGLIERA_FIDUCIA_ID, titleKey: `${CONSIGLIERA_FIDUCIA_KEY}.title` },
  {
    id: SPORTELLO_ANTIVIOLENZA_ID,
    titleKey: `${SPORTELLO_ANTIVIOLENZA_KEY}.title`,
  },
];

export const studentsUsefulContactsList: UsefulContact[] = [
  ...defaultUsefulContactsList,
  { id: GARANTE_STUDENTI_ID, titleKey: `${GARANTE_STUDENTI_KEY}.title` },
];

const SIZE = 14;
const LINE_HEIGHT = SIZE * 1.3;

const styles = StyleSheet.create({
  body: {
    fontFamily: 'Montserrat-Regular',
    fontSize: SIZE,
    lineHeight: LINE_HEIGHT,
  },
  medium: {
    fontFamily: 'Montserrat-Medium',
    fontSize: SIZE,
    lineHeight: LINE_HEIGHT,
  },
  italic: {
    fontFamily: 'Montserrat-Italic',
    fontSize: SIZE,
    lineHeight: LINE_HEIGHT,
  },
  bulletRow: {
    flexDirection: 'row',
  },
  bulletMarker: {
    width: 16,
    fontFamily: 'Montserrat-Regular',
    fontSize: SIZE,
    lineHeight: LINE_HEIGHT,
  },
  bulletBody: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: SIZE,
    lineHeight: LINE_HEIGHT,
  },
  paragraphSpacer: {
    height: 12,
  },
});

const Paragraph = ({
  i18nKey,
  style,
}: {
  i18nKey: string;
  style?: StyleProp<TextStyle>;
}) => (
  <Text variant="prose" style={[styles.body, style]}>
    <Trans
      i18nKey={i18nKey}
      components={{
        b: <Text key="b" style={styles.medium} />,
        i: <Text key="i" style={styles.italic} />,
      }}
    />
  </Text>
);

const Bullet = ({ i18nKey }: { i18nKey: string }) => (
  <View style={styles.bulletRow}>
    <Text variant="prose" style={styles.bulletMarker}>
      •
    </Text>
    <Paragraph i18nKey={i18nKey} style={styles.bulletBody} />
  </View>
);

const ParagraphSpacer = () => <View style={styles.paragraphSpacer} />;

export const useUsefulContactsContent = (): Record<
  string,
  UsefulContactDetail
> => {
  const { t } = useTranslation();

  return {
    [CONSIGLIERA_FIDUCIA_ID]: {
      title: t(`${CONSIGLIERA_FIDUCIA_KEY}.title`),
      description: {
        paragraphs: [
          <Paragraph
            i18nKey={`${CONSIGLIERA_FIDUCIA_KEY}.description.paragraph1`}
          />,
          <ParagraphSpacer />,
          <Paragraph
            i18nKey={`${CONSIGLIERA_FIDUCIA_KEY}.description.paragraph2`}
          />,
        ],
      },
      info: {
        title: t(`${CONSIGLIERA_FIDUCIA_KEY}.info.title`),
        body: <Paragraph i18nKey={`${CONSIGLIERA_FIDUCIA_KEY}.info.body`} />,
      },
      contacts: [
        {
          icon: faEnvelope,
          title: t(`${CONSIGLIERA_FIDUCIA_KEY}.contacts.email`),
          value: 'consigliera.fiducia@polito.it',
          action: { kind: 'email', target: 'consigliera.fiducia@polito.it' },
        },
      ],
    },
    [SPORTELLO_ANTIVIOLENZA_ID]: {
      title: t(`${SPORTELLO_ANTIVIOLENZA_KEY}.title`),
      description: {
        paragraphs: [
          <Paragraph
            i18nKey={`${SPORTELLO_ANTIVIOLENZA_KEY}.description.paragraph1`}
          />,
        ],
        warning: t(`${SPORTELLO_ANTIVIOLENZA_KEY}.description.warning`),
      },
      info: {
        title: t(`${SPORTELLO_ANTIVIOLENZA_KEY}.info.title`),
        body: (
          <View>
            <Paragraph
              i18nKey={`${SPORTELLO_ANTIVIOLENZA_KEY}.info.noBooking`}
            />
            <Paragraph
              i18nKey={`${SPORTELLO_ANTIVIOLENZA_KEY}.info.openingHours`}
            />
            <Bullet
              i18nKey={`${SPORTELLO_ANTIVIOLENZA_KEY}.info.firstWednesdays`}
            />
            <Bullet
              i18nKey={`${SPORTELLO_ANTIVIOLENZA_KEY}.info.lastWednesday`}
            />
          </View>
        ),
      },
      contacts: [
        {
          icon: faEnvelope,
          title: t(`${SPORTELLO_ANTIVIOLENZA_KEY}.contacts.email`),
          value: 'sportellopolito@emmacentriantiviolenza.com',
          action: {
            kind: 'email',
            target: 'sportellopolito@emmacentriantiviolenza.com',
          },
        },
        {
          icon: faPhone,
          title: t(`${SPORTELLO_ANTIVIOLENZA_KEY}.contacts.phone`),
          value: '0115187438',
          action: { kind: 'tel', target: '0115187438' },
        },
        {
          icon: faTriangleExclamation,
          title: t(`${SPORTELLO_ANTIVIOLENZA_KEY}.contacts.emergency`),
          value: '3664607803',
          action: { kind: 'tel', target: '3664607803' },
        },
      ],
    },
    [GARANTE_STUDENTI_ID]: {
      title: t(`${GARANTE_STUDENTI_KEY}.title`),
      description: {
        paragraphs: [
          <Paragraph
            i18nKey={`${GARANTE_STUDENTI_KEY}.description.paragraph1`}
          />,
          <ParagraphSpacer />,
          <Paragraph
            i18nKey={`${GARANTE_STUDENTI_KEY}.description.paragraph2`}
          />,
        ],
      },
      info: {
        title: t(`${GARANTE_STUDENTI_KEY}.info.title`),
        body: (
          <View>
            <Paragraph i18nKey={`${GARANTE_STUDENTI_KEY}.info.paragraph1`} />
            <ParagraphSpacer />
            <Paragraph i18nKey={`${GARANTE_STUDENTI_KEY}.info.paragraph2`} />
          </View>
        ),
      },
      contacts: [
        {
          icon: faEnvelope,
          title: t(`${GARANTE_STUDENTI_KEY}.contacts.email`),
          value: 'garante.studenti@polito.it',
          action: { kind: 'email', target: 'garante.studenti@polito.it' },
        },
        {
          icon: faLink,
          title: t(`${GARANTE_STUDENTI_KEY}.contacts.moreInfo`),
          value: t(`${GARANTE_STUDENTI_KEY}.contacts.moreInfoValue`),
          action: { kind: 'link', target: GARANTE_STUDENTI_URL },
        },
      ],
    },
  };
};
