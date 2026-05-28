import { StyleSheet, View } from 'react-native';

import {
  faEnvelope,
  faPhone,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

import { Text } from '../../../ui/components/Text';
import { UsefulContact, UsefulContactDetail } from '../types';

export const CONSIGLIERA_FIDUCIA_ID = 'consigliera-fiducia';
export const SPORTELLO_ANTIVIOLENZA_ID = 'sportello-antiviolenza';

export const defaultUsefulContactsList: UsefulContact[] = [
  { id: CONSIGLIERA_FIDUCIA_ID, title: 'Consigliera di Fiducia' },
  { id: SPORTELLO_ANTIVIOLENZA_ID, title: 'Sportello Antiviolenza' },
];

const styles = StyleSheet.create({
  bulletRow: {
    flexDirection: 'row',
  },
  bulletMarker: {
    width: 16,
  },
  bulletBody: {
    flex: 1,
  },
  paragraphSpacer: {
    height: 12,
  },
});

const SportelloDescription = () => (
  <Text variant="prose">
    Lo sportello antiviolenza dell’ateneo “Non sei sola”, gestito da{' '}
    <Text italic>E.M.M.A. Onlus</Text>, offre uno{' '}
    <Text weight="medium">spazio sicuro di ascolto</Text> e{' '}
    <Text weight="medium">consulenza gratuita</Text> per{' '}
    <Text weight="medium">prevenire e affrontare la violenza di genere</Text>,
    garantendo sempre la privacy e il consenso della persona.
  </Text>
);

const SportelloInfoBody = () => (
  <View>
    <Text variant="prose">
      <Text weight="medium">Non</Text> serve prenotazione!{' '}
    </Text>
    <Text variant="prose">
      Lo sportello, ad accesso diretto, è{' '}
      <Text weight="medium">aperto dalle 14:30 alle 17:30</Text>:
    </Text>
    <View style={styles.bulletRow}>
      <Text variant="prose" style={styles.bulletMarker}>
        •
      </Text>
      <Text variant="prose" style={styles.bulletBody}>
        Primi tre mercoledì del mese: Atrio di ingresso del corridoio che
        conduce alla Biblioteca Centrale di Ingegneria,{' '}
        <Text weight="medium">Corso Duca degli Abruzzi 24</Text>
      </Text>
    </View>
    <View style={styles.bulletRow}>
      <Text variant="prose" style={styles.bulletMarker}>
        •
      </Text>
      <Text variant="prose" style={styles.bulletBody}>
        Ultimo mercoledì del mese: Castello del Valentino,{' '}
        <Text weight="medium">Viale Mattioli 39</Text>{' '}
      </Text>
    </View>
  </View>
);

export const defaultUsefulContactsContent: Record<string, UsefulContactDetail> =
  {
    [CONSIGLIERA_FIDUCIA_ID]: {
      title: 'Consigliera di fiducia',
      description: {
        paragraphs: [
          <Text variant="prose">
            La Consigliera di fiducia è la consulente esterna di riferimento per
            i casi di violenza, molestie anche di natura sessuale e
            discriminazioni che si verificano all’interno dell’Ateneo. Fornisce
            un servizio gratuito di consulenza e assistenza su prenotazione a
            studenti e studentesse, docenti e PTAB.
          </Text>,
          <View style={styles.paragraphSpacer} />,
          <Text variant="prose">
            La Consigliera garantisce la privacy della persona segnalante e
            agisce esclusivamente con il suo consenso.{' '}
          </Text>,
        ],
      },
      info: {
        title: 'Prenotare un colloquio',
        body: (
          <Text variant="prose">
            La prenotazione del colloquio avviene via email. La Consigliera
            risponderà alla richiesta entro due giorni. Il colloquio potrà
            avvenire anche in modalità da remoto.
          </Text>
        ),
      },
      contacts: [
        {
          icon: faEnvelope,
          title: 'Email',
          value: 'consigliera.fiducia@polito.it',
          action: { kind: 'email', target: 'consigliera.fiducia@polito.it' },
        },
      ],
    },
    [SPORTELLO_ANTIVIOLENZA_ID]: {
      title: 'Sportello Antiviolenza',
      description: {
        paragraphs: [<SportelloDescription />],
        warning:
          'Anche episodi ambigui o apparentemente lievi vanno considerati: parlane con persone fidate e rivolgiti allo Sportello Antiviolenza dell’Ateneo, aperto a tutt* per informazioni, orientamento e prevenzione.',
      },
      info: {
        title: 'Prenotare un colloquio',
        body: <SportelloInfoBody />,
      },
      contacts: [
        {
          icon: faEnvelope,
          title: 'Email',
          value: 'sportellopolito@emmacentriantiviolenza.com',
          action: {
            kind: 'email',
            target: 'sportellopolito@emmacentriantiviolenza.com',
          },
        },
        {
          icon: faPhone,
          title: 'Telefono per informazioni o appuntamenti',
          value: '0115187438',
          action: { kind: 'tel', target: '0115187438' },
        },
        {
          icon: faTriangleExclamation,
          title: 'Numero per emergenze',
          value: '3664607803',
          action: { kind: 'tel', target: '3664607803' },
        },
      ],
    },
  };
