import { StyleSheet, View } from 'react-native';

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

const GARANTE_STUDENTI_URL = '';

export const defaultUsefulContactsList: UsefulContact[] = [
  { id: CONSIGLIERA_FIDUCIA_ID, title: 'Consigliera di Fiducia' },
  { id: SPORTELLO_ANTIVIOLENZA_ID, title: 'Sportello Antiviolenza' },
];

export const studentsUsefulContactsList: UsefulContact[] = [
  ...defaultUsefulContactsList,
  { id: GARANTE_STUDENTI_ID, title: 'Garante degli studenti' },
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

const SportelloDescription = () => (
  <Text variant="prose" style={styles.body}>
    Lo sportello antiviolenza dell’Ateneo “Non sei sola”, gestito da{' '}
    <Text style={styles.italic}>E.M.M.A. Onlus</Text>, offre uno{' '}
    <Text style={styles.medium}>spazio sicuro di ascolto</Text> e{' '}
    <Text style={styles.medium}>consulenza gratuita</Text> per{' '}
    <Text style={styles.medium}>
      prevenire e affrontare la violenza di genere
    </Text>
    , garantendo sempre la privacy e il consenso della persona.
  </Text>
);

const SportelloInfoBody = () => (
  <View>
    <Text variant="prose" style={styles.body}>
      <Text style={styles.medium}>Non</Text> serve prenotazione!{' '}
    </Text>
    <Text variant="prose" style={styles.body}>
      Lo sportello, ad accesso diretto, è{' '}
      <Text style={styles.medium}>aperto dalle 14:30 alle 17:30</Text>:
    </Text>
    <View style={styles.bulletRow}>
      <Text variant="prose" style={styles.bulletMarker}>
        •
      </Text>
      <Text variant="prose" style={styles.bulletBody}>
        Primi tre mercoledì del mese: Atrio di ingresso del corridoio che
        conduce alla Biblioteca Centrale di Ingegneria,{' '}
        <Text style={styles.medium}>Corso Duca degli Abruzzi 24</Text>
      </Text>
    </View>
    <View style={styles.bulletRow}>
      <Text variant="prose" style={styles.bulletMarker}>
        •
      </Text>
      <Text variant="prose" style={styles.bulletBody}>
        Ultimo mercoledì del mese: Castello del Valentino,{' '}
        <Text style={styles.medium}>Viale Mattioli 39</Text>{' '}
      </Text>
    </View>
  </View>
);

const GaranteInfoBody = () => (
  <View>
    <Text variant="prose" style={styles.body}>
      È possibile inviare una segnalazione tramite email, descrivendo con
      ragionevole dettaglio il problema da esaminare.
    </Text>
    <View style={styles.paragraphSpacer} />
    <Text variant="prose" style={styles.body}>
      Il messaggio deve essere firmato e contenere i riferimenti necessari
      affinché il Garante possa mettersi in contatto con chi scrive, se
      necessario. Il testo della segnalazione deve essere scritto interamente
      nel corpo dell'email. Eventuali allegati sono consentiti esclusivamente in
      formato PDF.
    </Text>
  </View>
);

export const defaultUsefulContactsContent: Record<string, UsefulContactDetail> =
  {
    [CONSIGLIERA_FIDUCIA_ID]: {
      title: 'Consigliera di fiducia',
      description: {
        paragraphs: [
          <Text variant="prose" style={styles.body}>
            La Consigliera di fiducia è la consulente esterna di riferimento per
            i casi di violenza, molestie anche di natura sessuale e
            discriminazioni che si verificano all'interno dell'Ateneo. Fornisce
            un servizio gratuito di consulenza e assistenza su prenotazione a
            studenti e studentesse, docenti e PTAB.
          </Text>,
          <View style={styles.paragraphSpacer} />,
          <Text variant="prose" style={styles.body}>
            La Consigliera garantisce la privacy della persona segnalante e
            agisce esclusivamente con il suo consenso.{' '}
          </Text>,
        ],
      },
      info: {
        title: 'Prenotare un colloquio',
        body: (
          <Text variant="prose" style={styles.body}>
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
    [GARANTE_STUDENTI_ID]: {
      title: 'Garante degli studenti',
      description: {
        paragraphs: [
          <Text variant="prose" style={styles.body}>
            Il Garante studenti è il referente per le funzioni di garanzia della
            popolazione studentesca. Viene nominato dal Comitato Paritetico per
            la Didattica tra i docenti di I fascia dell'Ateneo che abbiano
            presentato la propria candidatura. Sulla base delle segnalazioni
            ricevute, approfondisce le problematiche e interviene per affrontare
            e risolvere le criticità riscontrate. A seguito dei necessari
            accertamenti, propone agli organi competenti le opportune iniziative
            e ne riferisce annualmente al Comitato Paritetico per la Didattica.
            Per le questioni che implicano problemi di riservatezza personale,
            riferisce direttamente al Rettore.
          </Text>,
          <View style={styles.paragraphSpacer} />,
          <Text variant="prose" style={styles.body}>
            Il Garante adotta ogni azione utile per salvaguardare, ove
            possibile, la riservatezza di chi si rivolge a questa figura.
          </Text>,
        ],
      },
      info: {
        title: 'Come contattarlo',
        body: <GaranteInfoBody />,
      },
      contacts: [
        {
          icon: faEnvelope,
          title: 'Email',
          value: 'garante.studenti@polito.it',
          action: { kind: 'email', target: 'garante.studenti@polito.it' },
        },
        {
          icon: faLink,
          title: 'Maggiori informazioni',
          value:
            'Per maggiori informazioni, consulta la pagina dedicata sul sito del Politecnico.',
          action: { kind: 'link', target: GARANTE_STUDENTI_URL },
        },
      ],
    },
  };
