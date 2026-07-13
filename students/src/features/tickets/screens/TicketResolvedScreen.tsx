import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  CtaButtonContainer,
  Icon,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useHeaderHeight } from '@react-navigation/elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useProvideTicketFeedback } from '~/core/queries/ticketHooks';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { PodiumIcon } from '../components/PodiumIcon';
import { exitToTicketsList } from '../utils/exitToTicketsList';

type Props = NativeStackScreenProps<ServiceStackParamList, 'TicketResolved'>;

const MIN_COMMENT_LENGTH = 100;
const MAX_RATING_REQUIRING_COMMENT = 2;
const RATINGS = [1, 2, 3, 4, 5];
const PODIUM_ICON_SIZE = 64;
const STAR_ICON_SIZE = 32;

export const TicketResolvedScreen = ({ route, navigation }: Props) => {
  const { ticketId } = route.params;
  const { t } = useTranslation();
  const { palettes, colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const headerHeight = useHeaderHeight();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutateAsync: provideFeedback, isPending } =
    useProvideTicketFeedback(ticketId);

  const commentLength = comment.trim().length;
  const commentValid = commentLength >= MIN_COMMENT_LENGTH;
  const commentRequired = rating > 0 && rating <= MAX_RATING_REQUIRING_COMMENT;
  const canSubmit = rating > 0 && (!commentRequired || commentValid);
  const showError = commentRequired && !commentValid;

  const counterColor = commentValid
    ? palettes.success[700]
    : palettes.danger[600];
  const helperColor = showError ? palettes.danger[600] : colors.secondaryText;

  const onSubmit = () => {
    if (!canSubmit || isPending) {
      return;
    }
    provideFeedback({ rating, comment: comment.trim() || undefined })
      .then(() => exitToTicketsList(navigation))
      .catch(() => Alert.alert(t('common.error'), t('ticketScreen.sendError')));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          Platform.OS === 'ios' && { paddingTop: headerHeight + spacing[5] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerIcon}>
          <PodiumIcon size={PODIUM_ICON_SIZE} color={palettes.success[700]} />
        </View>
        <Text variant="heading" style={styles.title}>
          {t('ticketResolvedScreen.title')}
        </Text>

        <Text variant="title" style={styles.question}>
          {t('ticketResolvedScreen.rateQuestion')}
        </Text>
        <Row gap={3} align="center" justify="center" style={styles.starsRow}>
          {RATINGS.map(value => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={t('ticketResolvedScreen.rateValue', {
                value,
              })}
              onPress={() => setRating(value)}
              hitSlop={8}
            >
              <Icon
                icon={value <= rating ? faStar : faStarRegular}
                size={STAR_ICON_SIZE}
                color={palettes.orange[500]}
              />
            </Pressable>
          ))}
        </Row>

        <Text variant="secondaryText" style={styles.commentLabel}>
          {t('ticketResolvedScreen.commentLabel')}
          {commentRequired ? '*' : ''}
        </Text>
        <View style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder={t('ticketResolvedScreen.commentPlaceholder')}
            placeholderTextColor={colors.secondaryText}
            multiline
            textAlignVertical="top"
          />
          {commentRequired && (
            <Text variant="secondaryText" style={styles.counter}>
              <Text style={{ color: counterColor }}>{commentLength}</Text>
              <Text
                style={styles.counterTotal}
              >{`/${MIN_COMMENT_LENGTH}`}</Text>
            </Text>
          )}
        </View>
        {commentRequired && (
          <Text
            variant="secondaryText"
            style={[styles.helper, { color: helperColor }]}
          >
            {t('ticketResolvedScreen.minCharsHint')}
          </Text>
        )}
      </ScrollView>

      <CtaButtonContainer absolute>
        <CtaButton
          absolute={false}
          title={t('ticketResolvedScreen.sendFeedback')}
          action={onSubmit}
          loading={isPending}
          style={canSubmit ? undefined : styles.buttonDisabled}
        />
      </CtaButtonContainer>
    </View>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  palettes,
  shapes,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      padding: spacing[5],
      paddingBottom: spacing[24],
      alignItems: 'center',
    },
    headerIcon: {
      marginTop: spacing[6],
      marginBottom: spacing[6],
    },
    title: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.semibold,
      textAlign: 'center',
      marginBottom: spacing[6],
    },
    question: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.prose,
      textAlign: 'center',
    },
    starsRow: {
      marginTop: spacing[2.5],
      marginBottom: spacing[6],
    },
    commentLabel: {
      alignSelf: 'flex-start',
      fontSize: fontSizes.xs,
      marginBottom: spacing[1],
    },
    commentBox: {
      width: '100%',
      height: 140,
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    commentInput: {
      flex: 1,
      fontSize: fontSizes.sm,
      color: colors.prose,
      padding: 0,
    },
    counter: {
      alignSelf: 'flex-end',
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
    counterTotal: {
      color: colors.secondaryText,
    },
    helper: {
      alignSelf: 'flex-start',
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      marginTop: spacing[1],
    },
    buttonDisabled: {
      backgroundColor: palettes.gray[400],
      borderColor: palettes.gray[400],
    },
  });
