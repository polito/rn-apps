import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

import {
  faCircleXmark,
  faPaperPlane,
} from '@fortawesome/free-regular-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { ApiError } from '@polito/lib/core';
import {
  CtaButton,
  IconButton,
  OverviewList,
  ScreenContainer,
  Section,
  SectionHeader,
  Select,
  Text,
  TextField,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { CreateTicketRequest } from '@polito/student-api-client';
import { MenuAction } from '@react-native-menu/menu';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  useCreateTicket,
  useGetTicketTopics,
} from '../../../core/queries/ticketHooks';
import type { RootParamList } from '../../../core/types/navigation';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { Attachment } from '../../services/types/Attachment';
import { AttachmentMenu } from '../components/AttachmentMenu';

type Props = NativeStackScreenProps<ServiceStackParamList, 'CreateTicket'>;
const DESCRIPTION_MAX_LENGTH = 128;

export const CreateTicketScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { topicId: initialTopicId, subtopicId: initialSubtopicId } =
    route.params ?? {};
  const ticketTopicQuery = useGetTicketTopics();
  const topics = useMemo(() => {
    if (!ticketTopicQuery.data) return [];
    return ticketTopicQuery.data;
  }, [ticketTopicQuery.data]);
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);

  const [topicId, setTopicId] = useState(initialTopicId?.toString());
  const [ticketBody, setTicketBody] = useState<Partial<CreateTicketRequest>>({
    subject: undefined,
    message: undefined,
    subtopicId: initialSubtopicId,
    attachment: undefined,
  });
  const attachment = ticketBody.attachment as unknown as Attachment | undefined;
  const hasSubject = !!ticketBody.subject?.trim();
  const remainingCharacters =
    DESCRIPTION_MAX_LENGTH - (ticketBody.message?.length ?? 0);
  const {
    mutateAsync: handleCreateTicket,
    isPending,
    isSuccess,
    data,
  } = useCreateTicket();

  const createTopicEnabled = useMemo(() => {
    const { message, subtopicId } = ticketBody;
    return hasSubject && !!message?.trim() && !!subtopicId;
  }, [hasSubject, ticketBody]);

  useEffect(() => {
    if (isSuccess && data?.id) {
      const routeNames = navigation.getState().routeNames;
      if (routeNames.includes('Ticket')) {
        navigation.navigate(initialTopicId ? 'Services' : 'Tickets');
        navigation.navigate('Ticket', { id: data.id });
        return;
      }

      navigation
        .getParent<NavigationProp<RootParamList>>()
        ?.navigate('ServicesTab', {
          screen: 'Ticket',
          params: { id: data.id },
          initial: false,
        });
    }
  }, [isSuccess, data, initialTopicId, navigation]);

  const subTopics = useMemo(
    () =>
      topics?.find(topic => topic.id.toString() === topicId)?.subtopics ?? [],
    [topicId, topics],
  );

  const updateTicketBodyField =
    (field: keyof CreateTicketRequest) => (value: string | number | Blob) => {
      setTicketBody(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };

  const updateTopicId = (value: string) => {
    setTopicId(value);
    setTicketBody(prevState => ({
      ...prevState,
      subtopicId: undefined,
      attachment: undefined,
    }));
  };

  const topicOptions = useMemo(() => {
    return topics.map(topic => ({
      id: topic.id.toString(),
      title: topic.name,
      state: (topic.id.toString() === topicId
        ? 'on'
        : 'off') as MenuAction['state'],
    }));
  }, [topicId, topics]);

  const subtopicOptions = useMemo(
    () =>
      subTopics.map(subtopic => {
        const subId = subtopic.id.toString();
        return {
          id: subId,
          title: subtopic.name,
          state: (subId === ticketBody.subtopicId?.toString()
            ? 'on'
            : 'off') as MenuAction['state'],
        };
      }),
    [subTopics, ticketBody.subtopicId],
  );

  const subjectAccessibilityLabel = useMemo(() => {
    const baseText = t('createTicketScreen.subject');
    if (ticketBody?.subtopicId) {
      return baseText;
    } else {
      return [baseText, t('common.disabledPreviousValue')].join(', ');
    }
  }, [t, ticketBody?.subtopicId]);

  const subtopicAccessibilityLabel = useMemo(() => {
    const baseText = t('createTicketScreen.subtopicDropdownLabelAccessibility');
    if (topicId) {
      return baseText;
    } else {
      return [baseText, t('common.disabledPreviousValue')].join(', ');
    }
  }, [t, topicId]);

  const handleCreateError = (err: ApiError) => {
    if (err.code === -33 && err.responseCode === 400) {
      Alert.alert(
        t('createTicketScreen.duplicateTitle'),
        t('createTicketScreen.duplicateMessage'),
      );
      return;
    }
  };

  return (
    <ScreenContainer>
      <Section>
        <SectionHeader title={t('createTicketScreen.subtitle')} />
        <OverviewList>
          <Select
            accessibilityLabel={t(
              'createTicketScreen.topicDropdownLabelAccessibility',
            )}
            label={t('createTicketScreen.topicDropdownLabel')}
            description={
              initialTopicId ? '' : t('createTicketScreen.topicDescription')
            }
            options={topicOptions}
            onSelectOption={updateTopicId}
            disabled={!!initialTopicId}
            hideChevron={!!initialTopicId}
            value={topicId}
          />
        </OverviewList>

        <OverviewList>
          <Select
            accessibilityLabel={subtopicAccessibilityLabel}
            options={subtopicOptions}
            onSelectOption={updateTicketBodyField('subtopicId')}
            disabled={!topicId || !!initialTopicId}
            hideChevron={!!initialTopicId}
            value={ticketBody?.subtopicId?.toString()}
            label={t('createTicketScreen.subtopicDropdownLabel')}
            description={
              initialSubtopicId
                ? ''
                : t('createTicketScreen.subtopicDescription')
            }
          />
        </OverviewList>

        <OverviewList style={styles.objectSection}>
          <View style={styles.objectContent}>
            <Text
              style={[
                styles.fieldLabel,
                !ticketBody?.subtopicId && styles.disabledFieldLabel,
              ]}
              weight="medium"
            >
              {t('createTicketScreen.subject')}
            </Text>
            <TextField
              accessibilityLabel={subjectAccessibilityLabel}
              autoCapitalize="sentences"
              label={t('createTicketScreen.subjectLabel')}
              style={styles.textField}
              inputStyle={[styles.textFieldInput, styles.objectInput]}
              editable={!!ticketBody?.subtopicId}
              value={ticketBody.subject}
              onChangeText={updateTicketBodyField('subject')}
            />
          </View>
        </OverviewList>

        <OverviewList style={styles.descriptionSection}>
          <View style={styles.descriptionContent}>
            <View style={styles.descriptionHeader}>
              <Text
                style={[
                  styles.fieldLabel,
                  styles.descriptionTitle,
                  !hasSubject && styles.disabledFieldLabel,
                ]}
                weight="medium"
              >
                {t('createTicketScreen.descriptionLabel')}
              </Text>
              <Text
                accessibilityLabel={t(
                  'createTicketScreen.remainingCharacters',
                  { count: remainingCharacters },
                )}
                style={[styles.fieldCaption, styles.descriptionCounter]}
                variant="secondaryText"
              >
                {remainingCharacters}
              </Text>
            </View>
            <TextField
              accessibilityLabel={t('createTicketScreen.descriptionLabel')}
              autoCapitalize="sentences"
              label={t('createTicketScreen.descriptionPlaceholder')}
              multiline
              numberOfLines={5}
              maxLength={DESCRIPTION_MAX_LENGTH}
              style={styles.textField}
              inputStyle={[styles.textFieldInput, styles.descriptionInput]}
              editable={hasSubject}
              value={ticketBody.message}
              onChangeText={updateTicketBodyField('message')}
            />
          </View>
        </OverviewList>

        {hasSubject && (
          <OverviewList style={styles.attachmentSection}>
            <View style={styles.attachmentField}>
              <View style={styles.attachmentDescription}>
                <Text style={styles.fieldLabel} weight="medium">
                  {t('createTicketScreen.attachmentLabel')}
                </Text>
                <Text
                  style={[
                    styles.fieldCaption,
                    !!attachment && styles.attachmentFileName,
                  ]}
                  variant="secondaryText"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  weight="medium"
                >
                  {attachment?.name ??
                    t('createTicketScreen.attachmentDescription')}
                </Text>
              </View>
              <AttachmentMenu
                disabled={!!attachment}
                onAttachmentChange={value =>
                  updateTicketBodyField('attachment')(value as unknown as Blob)
                }
              >
                <IconButton
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    attachment
                      ? 'common.removeAttachment'
                      : 'createTicketScreen.addAttachment',
                  )}
                  icon={attachment ? faCircleXmark : faPaperclip}
                  color={colors.secondaryText}
                  size={16}
                  noPadding
                  hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                  onPress={
                    attachment
                      ? () =>
                          setTicketBody(prevState => ({
                            ...prevState,
                            attachment: undefined,
                          }))
                      : undefined
                  }
                />
              </AttachmentMenu>
            </View>
          </OverviewList>
        )}
      </Section>

      <CtaButton
        absolute={false}
        disabled={!createTopicEnabled}
        title={t('createTicketScreen.sendTicket')}
        action={async () => {
          try {
            await handleCreateTicket({
              ...ticketBody,
              message: ticketBody?.message?.trim().replace(/\n/g, '<br>'),
            } as CreateTicketRequest);
          } catch (err) {
            handleCreateError(err as ApiError);
          }
        }}
        loading={isPending}
        icon={faPaperPlane}
      />
    </ScreenContainer>
  );
};

const createStyles = ({ colors, fontFamilies, fontSizes, spacing }: Theme) =>
  StyleSheet.create({
    attachmentDescription: {
      flex: 1,
      gap: 1,
    },
    attachmentField: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 9,
      paddingLeft: spacing[5],
      paddingRight: spacing[4],
      paddingVertical: 7,
    },
    attachmentFileName: {
      color: colors.prose,
    },
    attachmentSection: {
      height: 60,
      marginHorizontal: spacing[5],
    },
    fieldCaption: {
      fontSize: fontSizes.sm,
      lineHeight: 21,
    },
    objectContent: {
      gap: 1,
      paddingLeft: spacing[5],
      paddingRight: spacing[4],
      paddingVertical: 7,
    },
    objectInput: {
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.sm,
      lineHeight: 21,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    descriptionContent: {
      gap: 1,
      paddingHorizontal: spacing[5],
      paddingVertical: 9,
    },
    descriptionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
      height: 24,
    },
    descriptionSection: {
      height: 175,
      marginHorizontal: spacing[5],
    },
    descriptionCounter: {
      textAlign: 'right',
    },
    descriptionTitle: {
      flex: 1,
    },
    descriptionInput: {
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.sm,
      lineHeight: 21,
      minHeight: 42,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    disabledFieldLabel: {
      color: colors.secondaryText,
    },
    fieldLabel: {
      lineHeight: 24,
    },
    objectSection: {
      height: 60,
      marginHorizontal: spacing[5],
    },
    textField: {
      paddingVertical: 0,
    },
    textFieldInput: {
      borderBottomWidth: 0,
    },
  });
