import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import {
  Col,
  CtaButton,
  Icon,
  ListItem,
  ModalContent,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

export type ContactMethod = 'email' | 'notify';

type Props = {
  selectedCount: number;
  close: () => void;
  onContinue: (method: ContactMethod) => void;
};

export const ContactMethodOverlay = ({
  selectedCount,
  close,
  onContinue,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(
    null,
  );

  const studentsLabel = t('other.students', {
    defaultValue: 'students',
  }).toLowerCase();

  const handleClose = () => {
    setSelectedMethod(null);
    close();
  };

  const handleContinue = () => {
    if (!selectedMethod) return;
    const method = selectedMethod;
    setSelectedMethod(null);
    close();
    onContinue(method);
  };

  return (
    <ModalContent
      title={t('other.contactSelected', { defaultValue: 'Contact selected' })}
      close={handleClose}
    >
      <Col ph={5} pt={3} pb={4} gap={3}>
        <Text style={styles.introText}>
          <Text weight="semibold">
            {selectedCount} {studentsLabel}
          </Text>
          {` ${t('other.willBeContactedBy', { defaultValue: 'will be contacted by:' })}`}
        </Text>
        <ListItem
          title={t('other.email', { defaultValue: 'Email' })}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedMethod === 'email' }}
          containerStyle={styles.option}
          onPress={() => setSelectedMethod('email')}
          trailingItem={
            <Icon
              icon={selectedMethod === 'email' ? faCircleDot : faCircle}
              size={16}
              color={palettes.primary[500]}
            />
          }
        />
        <ListItem
          title={t('other.notify', { defaultValue: 'Notify' })}
          subtitle={t('other.notifySubtitle', {
            defaultValue:
              'If the student has not installed the app, they will be sent an SMS',
          })}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedMethod === 'notify' }}
          containerStyle={styles.option}
          onPress={() => setSelectedMethod('notify')}
          trailingItem={
            <Icon
              icon={selectedMethod === 'notify' ? faCircleDot : faCircle}
              size={16}
              color={palettes.primary[500]}
            />
          }
        />
        <CtaButton
          absolute={false}
          title={t('other.continue', { defaultValue: 'Continue' })}
          disabled={selectedMethod === null}
          action={handleContinue}
        />
      </Col>
    </ModalContent>
  );
};

const createStyles = ({ spacing, colors, shapes }: Theme) =>
  StyleSheet.create({
    introText: {
      paddingLeft: spacing[3],
    },
    option: {
      backgroundColor: colors.background,
      borderRadius: shapes.lg,
    },
  });
