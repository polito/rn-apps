import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import {
  Col,
  CtaButton,
  Icon,
  ListItem,
  ModalContent,
  Text,
  Theme,
  useHideTabs,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

type ContactMethod = 'email' | 'notify';

type Props = NativeStackScreenProps<
  StudentsStackParamList,
  'SelectContactMethod'
>;

export const SelectContactMethodScreen = ({ navigation, route }: Props) => {
  useHideTabs();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedIds } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(
    null,
  );

  const studentsLabel = t('other.students', {
    defaultValue: 'students',
  }).toLowerCase();

  const handleClose = () => navigation.goBack();

  const handleContinue = () => {
    if (selectedMethod === 'email') {
      navigation.replace('EmailCompose', { selectedIds });
      return;
    }
    if (selectedMethod === 'notify') {
      navigation.replace('NotifyCompose', { selectedIds });
    }
  };

  return (
    <View style={styles.overlay}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.black }]}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
      />
      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
        <ModalContent
          title={t('other.contactSelected', {
            defaultValue: 'Contact selected',
          })}
          close={handleClose}
        >
          <Col ph={5} pt={3} pb={4} gap={3}>
            <Text style={styles.introText}>
              <Text weight="semibold">
                {selectedIds.length} {studentsLabel}
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
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing, shapes }: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.4,
    },
    sheet: {
      backgroundColor: colors.surface,
    },
    introText: {
      paddingLeft: spacing[3],
    },
    option: {
      backgroundColor: colors.background,
      borderRadius: shapes.lg,
    },
  });
