import { StyleProp, TextStyle } from 'react-native';

import { Text } from '@polito/lib/ui';

type HighlightedNameProps = {
  name: string;
  surname: string;
  query: string;
  nameStyle: StyleProp<TextStyle>;
  highlightStyle: StyleProp<TextStyle>;
};

export const HighlightedName = ({
  name,
  surname,
  query,
  nameStyle,
  highlightStyle,
}: HighlightedNameProps) => {
  if (!query) {
    return (
      <Text style={nameStyle} numberOfLines={1}>
        {name} {surname}
      </Text>
    );
  }

  const full = `${name} ${surname}`;
  const lowerFull = full.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerFull.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return (
      <Text style={nameStyle} numberOfLines={1}>
        {full}
      </Text>
    );
  }

  const before = full.slice(0, matchIndex);
  const match = full.slice(matchIndex, matchIndex + query.length);
  const after = full.slice(matchIndex + query.length);

  return (
    <Text style={nameStyle} numberOfLines={1}>
      {before}
      <Text style={highlightStyle}>{match}</Text>
      {after}
    </Text>
  );
};
