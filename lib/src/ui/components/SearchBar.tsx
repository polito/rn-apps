import { StyleSheet } from 'react-native';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useSafeAreaSpacing } from '../hooks/useSafeAreaSpacing';
import { useStylesheet } from '../hooks/useStylesheet';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Theme } from '../types/Theme';
import { Row } from './Row';
import { TranslucentTextField } from './TranslucentTextField';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  onClearLabel?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  label,
  onClearLabel,
}: Props) => {
  const { paddingHorizontal } = useSafeAreaSpacing();
  const styles = useStylesheet(createStyles);

  return (
    <Row align="center" style={[paddingHorizontal, styles.searchBar]}>
      <TranslucentTextField
        autoFocus={value.length !== 0}
        autoCorrect={false}
        leadingIcon={faSearch}
        value={value}
        onChangeText={onChangeText}
        style={[GlobalStyles.grow, styles.textField]}
        label={label}
        editable={true}
        isClearable={!!value}
        onClear={() => onChangeText('')}
        onClearLabel={onClearLabel}
      />
    </Row>
  );
};

const createStyles = ({ spacing, shapes, colors }: Theme) =>
  StyleSheet.create({
    textField: {
      borderRadius: shapes.lg,
    },
    searchBar: {
      paddingBottom: spacing[2],
      paddingTop: spacing[2],
      backgroundColor: colors.background,
    },
  });
