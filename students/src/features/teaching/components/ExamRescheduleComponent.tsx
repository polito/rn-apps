import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { CtaButtonSpacer } from '@polito/lib';
import { OverviewList } from '@polito/lib';
import { ScreenTitle } from '@polito/lib';
import { Text } from '@polito/lib';
import { TextField } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { GlobalStyles } from '@polito/lib';
import { Theme } from '@polito/lib';

type ExamRescheduleProps = {
  firstState: { isError: boolean; value?: string };
  setFirstState: (value: { isError: boolean; value?: string }) => void;
  secondState: { isError: boolean; value?: string };
  setSecondState: (value: { isError: boolean; value?: string }) => void;
};

export const ExamRescheduleComponent = ({
  firstState,
  setFirstState,
  secondState,
  setSecondState,
}: ExamRescheduleProps) => {
  const styles = useStylesheet(createStyles);
  const { spacing } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScreenTitle
        style={{ marginVertical: spacing[2] }}
        title={t('examRescheduleScreen.requestReasonTitle')}
      />
      <OverviewList
        style={[styles.searchBar, firstState.isError && styles.searchBarError]}
      >
        <TextField
          label={t('examRescheduleScreen.requestReason')}
          multiline
          numberOfLines={5}
          value={firstState.value}
          onChangeText={value => setFirstState({ isError: false, value })}
          style={GlobalStyles.grow}
          inputStyle={{ borderBottomWidth: 0 }}
          onBlur={() => {
            if (!firstState.value) setFirstState({ isError: true });
          }}
        />
      </OverviewList>
      {firstState.isError && (
        <Text style={styles.errorFeedback}>
          {t('examRescheduleScreen.error')}
        </Text>
      )}
      <ScreenTitle
        style={{ marginVertical: spacing[3] }}
        title={t('examRescheduleScreen.requestDetailsTitle')}
      />
      <OverviewList
        style={[styles.searchBar, secondState.isError && styles.searchBarError]}
      >
        <TextField
          label={t('examRescheduleScreen.requestDetails')}
          multiline
          numberOfLines={5}
          value={secondState.value}
          onChangeText={value => setSecondState({ isError: false, value })}
          style={GlobalStyles.grow}
          inputStyle={{ borderBottomWidth: 0 }}
          onBlur={() => {
            if (!secondState.value) setSecondState({ isError: true });
          }}
        />
      </OverviewList>
      {secondState.isError && (
        <Text style={styles.errorFeedback}>
          {t('examRescheduleScreen.error')}
        </Text>
      )}
      <CtaButtonSpacer />
    </View>
  );
};

const createStyles = ({ dark, palettes, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
    },
    errorFeedback: {
      color: palettes.danger[dark ? 400 : 600],
    },
    screenTitle: {
      marginBottom: spacing[7],
    },
    searchBar: {
      marginHorizontal: 0,
      borderRadius: 8,
    },
    searchBarError: {
      borderWidth: 1,
      borderColor: palettes.danger[dark ? 400 : 600],
    },
  });
