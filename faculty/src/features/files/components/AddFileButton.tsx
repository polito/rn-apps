import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CtaButton, Theme, useStylesheet } from '@polito/lib/ui';

type AddFileButtonProps = {
  onPress: () => void;
  bottomOffset: number;
};

export const AddFileButton = ({
  onPress,
  bottomOffset,
}: AddFileButtonProps) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.ctaWrapper,
        {
          paddingBottom: bottomOffset + 18,
        },
      ]}
    >
      <CtaButton
        title={t('courseFilesTab.addFileOrFolder')}
        action={onPress}
        absolute={false}
        icon={faPlus}
        containerStyle={styles.ctaButtonContainer}
      />
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    ctaWrapper: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
    },
    ctaButtonContainer: {
      padding: 0,
    },
  });
