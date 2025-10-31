export type Accessibility = {
  fontFamily?:
    | 'default'
    | 'open-dyslexic'
    | 'dyslexie'
    | 'easy-reading'
    | 'sylexiad';
  fontPlacement?: 'none';
  highContrast?: boolean;
  grayscale?: boolean;
  lineHeight?: boolean;
  wordSpacing?: boolean;
  letterSpacing?: boolean;
  paragraphSpacing?: boolean;
  fontSize?: 100 | 125 | 150 | 175 | 200;
};
