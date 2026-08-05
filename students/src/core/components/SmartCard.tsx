import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Image,
  Mask,
  Path,
  Rect,
} from 'react-native-svg';

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Icon, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { StudentCareerStatusEnum } from '@polito/student-api-client';

import { useCareerStatusColors } from '../../features/user/hooks/useCareerStatusColors.ts';
import { PiedmontMap, PolitoLogo } from './SmartCardGraphics.tsx';

const CARD_WIDTH = 328;
const CARD_HEIGHT = 207;

const AVATAR = { x: 6, y: 17, size: 97 };
const STATUS_DOT = { cx: 95.5, cy: 106.5, r: 5.5 };
const AVATAR_PATH =
  'M97 69.7178C97 74.5562 93.0777 78.4785 88.2393 78.4785C83.4008 78.4785 79.4785 82.4008 79.4785 87.2393V87.7393C79.4785 92.8538 75.3323 97 70.2178 97H10C4.47715 97 0 92.5229 0 87V10C0 4.47715 4.47715 0 10 0H87C92.5229 0 97 4.47715 97 10V69.7178Z';

const HEADER_PATH =
  'M20.5 0C31.8218 2.57703e-07 41 9.17816 41 20.5C41 21.3284 41.6716 22 42.5 22H251.689C254.725 22 257.606 20.8277 260.251 19.3363C264.018 17.2122 268.367 16 273 16H365C379.359 16 391 27.6406 391 42C391 56.3594 379.359 68 365 68H273C263.158 68 254.593 62.5312 250.178 54.4666C246.731 48.1688 241.18 42 234 42H45.4853C40.9105 42 36.8577 44.671 33.2834 47.5262C29.7784 50.3261 25.3349 52 20.5 52C9.17816 52 7.43423e-08 42.8218 0 31.5V20.5C5.89782e-07 9.17816 9.17816 0 20.5 0Z';

type Props = {
  width: number;
  firstName: string;
  lastName: string;
  username: string;
  degreeName?: string;
  status?: StudentCareerStatusEnum;
  picture?: string;
  onShowQr?: () => void;
};

export const SmartCard = ({
  width,
  firstName,
  lastName,
  username,
  degreeName,
  status,
  picture,
  onShowQr,
}: Props) => {
  const { t } = useTranslation();
  const { colors, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const [, statusColor] = useCareerStatusColors(
    status ?? StudentCareerStatusEnum.Active,
  );
  const statusLabel = t(
    `profileScreen.careerStatusEnum.${status ?? StudentCareerStatusEnum.Active}`,
  );

  const s = width / CARD_WIDTH;
  const scaled = (value: number) => value * s;

  return (
    <View
      accessible={true}
      accessibilityLabel={[
        t('profileScreen.smartCard'),
        `${lastName} ${firstName}`,
        `${t('profileScreen.studentId')} ${username}`,
        degreeName,
        `${t('profileScreen.careerStatus')} ${statusLabel}`,
      ]
        .filter(Boolean)
        .join('. ')}
      style={[
        styles.card,
        {
          width,
          height: scaled(CARD_HEIGHT),
          borderRadius: scaled(18),
        },
      ]}
    >
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
      >
        <Defs>
          <Mask id="avatarMask">
            <Path
              d={AVATAR_PATH}
              transform={`translate(${AVATAR.x}, ${AVATAR.y})`}
              fill="#fff"
            />
          </Mask>
        </Defs>

        <PiedmontMap
          transform="translate(100.5, 14.5)"
          fill={palettes.gray[100]}
        />

        <G transform="translate(-31, -30)">
          <Path d={HEADER_PATH} fill={palettes.primary[700]} />
        </G>
        <PolitoLogo transform="translate(227, 5)" fill={colors.white} />

        <G mask="url(#avatarMask)">
          <Rect
            x={AVATAR.x}
            y={AVATAR.y}
            width={AVATAR.size}
            height={AVATAR.size}
            fill={palettes.gray[200]}
          />
          {picture ? (
            <Image
              href={{ uri: picture }}
              x={AVATAR.x}
              y={AVATAR.y}
              width={AVATAR.size}
              height={AVATAR.size}
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <G fill={palettes.gray[400]}>
              <Circle cx={AVATAR.x + 48.5} cy={AVATAR.y + 38} r={19} />
              <Circle cx={AVATAR.x + 48.5} cy={AVATAR.y + 97} r={31} />
            </G>
          )}
        </G>
        <Circle
          cx={STATUS_DOT.cx}
          cy={STATUS_DOT.cy}
          r={STATUS_DOT.r}
          fill={statusColor}
        />
      </Svg>

      <Text
        style={[
          styles.cardTitle,
          {
            left: scaled(110.5),
            top: scaled(16.5),
            fontSize: scaled(13),
          },
        ]}
      >
        {t('profileScreen.smartCardTitle')}
      </Text>

      <View
        style={{
          position: 'absolute',
          left: scaled(109.5),
          top: scaled(46.5),
          width: scaled(211),
          gap: scaled(4),
        }}
      >
        <View>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              { fontSize: scaled(20), lineHeight: scaled(25) },
            ]}
          >
            {lastName.toUpperCase()}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              { fontSize: scaled(20), lineHeight: scaled(25) },
            ]}
          >
            {firstName}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.degree,
            { fontSize: scaled(10), lineHeight: scaled(13) },
          ]}
        >
          {degreeName}
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          left: scaled(12.5),
          top: scaled(125.5),
          width: scaled(90),
        }}
      >
        <Text
          style={[
            styles.infoLabel,
            { fontSize: scaled(12), lineHeight: scaled(15) },
          ]}
        >
          {t('profileScreen.studentId')}
        </Text>
        <Text
          style={[
            styles.infoValue,
            { fontSize: scaled(12), lineHeight: scaled(15) },
          ]}
        >
          {username}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('profileScreen.showQr')}
        accessibilityHint={t('common.tapToNavigate')}
        onPress={onShowQr}
        style={[
          styles.qrButton,
          {
            right: scaled(9.5),
            bottom: scaled(9.5),
            gap: scaled(6),
            padding: scaled(8),
            borderRadius: scaled(8),
          },
        ]}
      >
        <Text style={[styles.qrButtonText, { fontSize: scaled(12) }]}>
          {t('profileScreen.showQr')}
        </Text>
        <Icon icon={faQrcode} size={scaled(20)} color={palettes.gray[800]} />
      </Pressable>
    </View>
  );
};

const createStyles = ({ colors, palettes }: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palettes.gray[600],
      overflow: 'hidden',
    },
    cardTitle: {
      position: 'absolute',
      fontFamily: 'Montserrat-Bold',
      color: palettes.gray[600],
    },
    name: {
      fontFamily: 'Montserrat-Bold',
      color: palettes.gray[700],
    },
    degree: {
      fontFamily: 'Montserrat-SemiBold',
      color: palettes.gray[600],
    },
    infoLabel: {
      fontFamily: 'Montserrat-Regular',
      color: palettes.gray[500],
    },
    infoValue: {
      fontFamily: 'Montserrat-SemiBold',
      color: palettes.gray[700],
    },
    qrButton: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palettes.primary[50],
    },
    qrButtonText: {
      fontFamily: 'Montserrat-SemiBold',
      color: palettes.gray[800],
    },
  });
