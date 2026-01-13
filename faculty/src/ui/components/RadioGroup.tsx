import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Option } from '../../ui/types/Input';
import { Theme } from '../../ui/types/Theme';
import { Col } from './Col';
import { ListItem } from './ListItem';
import { Text } from './Text';

interface Props<T> {
  options: Option<T>[];
  value: T;
  setValue: (value: T) => void;
  showError?: boolean;
}

export const RadioGroup = <T,>({
  options,
  value,
  setValue,
  showError,
}: Props<T>) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  return (
    <Col>
      {options.map((radioDefinition, index) => {
        const isSelected = radioDefinition.value === value;

        return (
          <ListItem
            key={index}
            onPress={() => setValue(radioDefinition.value)}
            titleStyle={styles.radioText}
            leadingItem={
              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioSelected,
                  showError && value === undefined && styles.radioError,
                ]}
              >
                {isSelected && <View style={styles.radioSelectedInner} />}
              </View>
            }
            title={radioDefinition.label}
          />
        );
      })}
      {showError && value === undefined && (
        <Text style={styles.groupErrorFeedback}>
          {t('common.selectAnOption')}
        </Text>
      )}
    </Col>
  );
};

const createStyles = ({ dark, colors, spacing, fontSizes, palettes }: Theme) =>
  StyleSheet.create({
    radio: {
      width: fontSizes.xl,
      height: fontSizes.xl,
      borderRadius: fontSizes.xl / 2,
      backgroundColor: colors.surface,
      borderColor: palettes.gray[300],
      borderWidth: 2,
    },
    radioText: {
      fontWeight: 'normal',
    },
    radioSelected: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: palettes.info[600],
    },
    radioSelectedInner: {
      width: fontSizes.xl / 2.5,
      height: fontSizes.xl / 2.5,
      borderRadius: fontSizes.xl / 5,
      backgroundColor: palettes.info[600],
      position: 'absolute',
    },
    radioError: {
      borderColor: palettes.danger[dark ? 500 : 600],
    },
    groupErrorFeedback: {
      color: palettes.danger[dark ? 400 : 600],
      paddingLeft: spacing[5],
      paddingTop: spacing[3],
    },
  });
