import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import i18next from 'i18next';

import { Card } from '../../../../lib/src/ui/components/Card';
import { Col } from '../../../../lib/src/ui/components/Col';
import { IconButton } from '../../../../lib/src/ui/components/IconButton';
import { Row } from '../../../../lib/src/ui/components/Row';
import { Text } from '../../../../lib/src/ui/components/Text';
import { useBottomBarAwareStyles } from '../../../../lib/src/ui/hooks/useBottomBarAwareStyles';
import { useStylesheet } from '../../../../lib/src/ui/hooks/useStylesheet';
import { useTheme } from '../../../../lib/src/ui/hooks/useTheme';
import { Theme } from '../../../../lib/src/ui/types/Theme';
import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ProfileNavigator';

interface InfoCardProps {
  title: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const InfoCard = ({
  title,
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: InfoCardProps) => {
  const { colors, spacing, fontSizes } = useTheme();
  const styles = useStylesheet(createCardStyles);
  const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(editValue);
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (editValue !== value) {
      onSave(editValue);
    } else {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <Card rounded style={styles.card}>
        <Col gap={1}>
          <Text
            variant="heading"
            style={[styles.title, { color: colors.heading }]}
          >
            {title}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              onBlur={handleBlur}
              onSubmitEditing={handleSubmit}
              style={styles.input}
              autoFocus
              returnKeyType="done"
              blurOnSubmit
            />
          </View>
        </Col>
      </Card>
    );
  }

  return (
    <Card rounded style={styles.card}>
      <Row justify="space-between" align="flex-start">
        <Col flex={1} gap={1}>
          <Text
            variant="heading"
            style={[styles.title, { color: colors.heading }]}
          >
            {title}
          </Text>
          <Text
            variant="secondaryText"
            style={[styles.value, { color: colors.prose }]}
            numberOfLines={2}
          >
            {value}
          </Text>
        </Col>
        <IconButton
          icon={faPen}
          size={fontSizes.md}
          color={colors.secondaryText}
          onPress={onEdit}
          accessibilityLabel="Modifica"
          hitSlop={{ left: spacing[2], right: spacing[2] }}
        />
      </Row>
    </Card>
  );
};

export const PersonalInfoScreen = () => {
  const { t } = useTranslation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user, setUser } = useCourses();
  const [editingField, setEditingField] = useState<
    'residence' | 'fiscalResidence' | 'iban' | null
  >(null);

  useLayoutEffect(() => {
    const marginLeft = i18next.language === 'en' ? 80 : 65;
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading" style={{ marginLeft }}>
          {t('other.personalInfo')}
        </Text>
      ),
    });
  }, [navigation, t]);

  const handleSave = (
    field: 'residence' | 'fiscalResidence' | 'iban',
    value: string,
  ) => {
    setUser({
      ...user,
      ...(field === 'residence' && { domicilie: value }),
      ...(field === 'fiscalResidence' && { taxDomicilie: value }),
      ...(field === 'iban' && { IBAN: value }),
    });
    setEditingField(null);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <View style={styles.container}>
        <InfoCard
          title={t('other.residence')}
          value={user.domicilie}
          isEditing={editingField === 'residence'}
          onEdit={() => setEditingField('residence')}
          onSave={value => handleSave('residence', value)}
          onCancel={() => setEditingField(null)}
        />
        <InfoCard
          title={t('other.fiscalResidence')}
          value={user.taxDomicilie}
          isEditing={editingField === 'fiscalResidence'}
          onEdit={() => setEditingField('fiscalResidence')}
          onSave={value => handleSave('fiscalResidence', value)}
          onCancel={() => setEditingField(null)}
        />
        <InfoCard
          title={t('IBAN')}
          value={user.IBAN}
          isEditing={editingField === 'iban'}
          onEdit={() => setEditingField('iban')}
          onSave={value => handleSave('iban', value)}
          onCancel={() => setEditingField(null)}
        />
      </View>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[5],
    },
  });

const createCardStyles = ({ spacing, fontSizes, colors, shapes }: Theme) =>
  StyleSheet.create({
    card: {
      marginBottom: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    title: {
      fontSize: fontSizes.sm,
      marginBottom: spacing[1],
    },
    value: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.4,
    },
    inputContainer: {
      borderWidth: 2,
      borderColor: colors.link,
      borderRadius: shapes.md,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      backgroundColor: colors.background,
    },
    input: {
      fontSize: fontSizes.md,
      color: colors.prose,
      minHeight: 40,
      textAlignVertical: 'top',
    },
  });
