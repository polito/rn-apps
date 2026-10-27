import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput } from 'react-native';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  GlobalStyles,
  Row,
  TextButton,
  Theme,
  TranslucentTextField,
  useStylesheet,
} from '@polito/lib/ui';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export const ExamStudentSearchBar = ({ value, onChangeText }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const onCancel = () => {
    onChangeText('');
    inputRef.current?.blur();
  };

  return (
    <Row align="center" style={styles.container}>
      <TranslucentTextField
        inputRef={inputRef}
        autoCorrect={false}
        leadingIcon={faSearch}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        label={t('examStudentsList.searchLabel')}
        accessibilityHint={t('examStudentsList.searchHint')}
        isClearable={value.length > 0}
        onClear={() => onChangeText('')}
        onClearLabel={t('examStudentsList.clearSearch')}
        containerStyle={styles.field}
        style={GlobalStyles.grow}
      />
      {isFocused && (
        <TextButton onPress={onCancel} accessibilityRole="button">
          {t('common.cancel')}
        </TextButton>
      )}
    </Row>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[4],
      gap: spacing[3],
    },
    field: {
      flex: 1,
      marginHorizontal: 0,
    },
  });
