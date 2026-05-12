import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

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
import { ProfileStackParamList } from '../../../src/screens/Profile/ProfileNavigator';
import { useCourses } from '../../core/contexts/CoursesContext';

interface InfoCardProps {
  title: string;
  value: string;
  onEdit?: () => void;
}

const InfoCard = ({ title, value, onEdit }: InfoCardProps) => {
  const { colors, spacing, fontSizes } = useTheme();
  const styles = useStylesheet(createCardStyles);

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
            {value || '-'}
          </Text>
        </Col>
        {onEdit && (
          <IconButton
            icon={faPen}
            size={fontSizes.md}
            color={colors.secondaryText}
            onPress={onEdit}
            accessibilityLabel="Modifica"
            hitSlop={{ left: spacing[2], right: spacing[2] }}
          />
        )}
      </Row>
    </Card>
  );
};

export const ContactsScreen = () => {
  const { t } = useTranslation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user } = useCourses();

  useLayoutEffect(() => {
    const marginLeft = i18next.language === 'en' ? 80 : 65;
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading" style={{ marginLeft }}>
          {t('contactsScreen.title')}
        </Text>
      ),
    });
  }, [navigation, t]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <View style={styles.container}>
        <InfoCard
          title={t('other.telephone')}
          value={user.phone}
          onEdit={() => {
            // TODO: Navigate to edit screen
          }}
        />
        <InfoCard
          title={t('other.academicEmail')}
          value={user.email}
          onEdit={() => {
            // TODO: Navigate to edit screen
          }}
        />
        <InfoCard
          title={t('other.privateMail')}
          value={user.privateMail}
          onEdit={() => {
            // TODO: Navigate to edit screen
          }}
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

const createCardStyles = ({ spacing, fontSizes }: Theme) =>
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
  });
