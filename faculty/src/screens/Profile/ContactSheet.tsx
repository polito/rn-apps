import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  ModalContent,
  Row,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { ProfileFieldInput, confirmAlert } from './ProfileFormFields';

export type ContactKind = 'url' | 'phone' | 'email';

const formats: Record<
  ContactKind,
  { hintKey: string; examples: string[]; pattern: RegExp }
> = {
  url: {
    hintKey: 'personalInfoScreen.urlFormat',
    examples: [
      'https://www.nomesito.com',
      'http://www.nomesito.com',
      'https://nomesito.com',
      'http://nomesito.com',
    ],
    pattern: /^https?:\/\/(www\.)?[^\s./]+(\.[^\s./]+)+(\/\S*)?$/i,
  },
  phone: {
    hintKey: 'personalInfoScreen.phoneFormat',
    examples: [
      'xxxxxxxxxx',
      '+xx xxxxxxxxxx',
      '+xxxxxxxxxxxx',
      '(+xx)xxxxxxxxxx',
      '(+xx) xxxxxxxxxx',
    ],
    pattern: /^(\(\+\d{2}\) ?|\+\d{2} ?)?\d{6,12}$/,
  },
  email: {
    hintKey: 'personalInfoScreen.emailFormat',
    examples: [
      'email@dominio.it',
      'em.ail@dominio.it',
      'email@domi.nio.it',
      'em.ail@dom.inio.it',
    ],
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

const keyboardTypes = {
  url: 'url',
  phone: 'phone-pad',
  email: 'email-address',
} as const;

type ContactSheetProps = {
  title: string;
  label: string;
  kind: ContactKind;
  initialValue?: string;
  confirmMessage?: string;
  onConfirm: (value: string) => void;
  onDelete?: () => void;
  close: () => void;
};

export const ContactSheet = ({
  title,
  label,
  kind,
  initialValue = '',
  confirmMessage,
  onConfirm,
  onDelete,
  close,
}: ContactSheetProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const [value, setValue] = useState(initialValue);
  const format = formats[kind];
  const trimmed = value.trim();
  const isValid = format.pattern.test(trimmed);

  const confirm = () => {
    const submit = () => {
      onConfirm(trimmed);
      close();
    };
    if (!confirmMessage) return submit();
    confirmAlert(t, confirmMessage, submit);
  };

  return (
    <ModalContent title={title} close={close}>
      <View style={styles.content}>
        <ProfileFieldInput
          label={label}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardTypes[kind]}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          hint={[t(format.hintKey), ...format.examples].join('\n• ')}
        />
        <Row style={styles.actions}>
          {onDelete && (
            <View style={styles.flex}>
              <CtaButton
                title={t('common.delete')}
                icon={faTrash}
                destructive
                variant="outlined"
                absolute={false}
                action={() => {
                  onDelete();
                  close();
                }}
              />
            </View>
          )}
          <View style={styles.flex}>
            <CtaButton
              title={t('common.confirm')}
              icon={faCheck}
              absolute={false}
              disabled={!isValid}
              action={confirm}
            />
          </View>
        </Row>
      </View>
    </ModalContent>
  );
};

type InfoSheetProps = PropsWithChildren<{
  title: string;
  close: () => void;
}>;

export const InfoSheet = ({ title, close, children }: InfoSheetProps) => {
  const styles = useStylesheet(createStyles);
  return (
    <ModalContent title={title} close={close}>
      <View style={[styles.content, styles.info]} accessible>
        {children}
      </View>
    </ModalContent>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    content: {
      padding: spacing[4],
      gap: spacing[2],
    },
    info: {
      paddingBottom: spacing[10],
    },
    actions: {
      marginHorizontal: -spacing[4],
    },
  });
