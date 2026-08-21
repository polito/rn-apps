import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { isTablet as isTabletHelper } from 'react-native-device-info';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useDeviceOrientation } from '@polito/lib/core';
import {
  CtaButton,
  CtaButtonContainer,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  EuropeanStudentCard,
  StudentCareerStatusEnum,
} from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { UserStackParamList } from '../../features/user/components/UserNavigator.tsx';
import { EscCard } from './EscCard.tsx';
import { SmartCard } from './SmartCard.tsx';

interface CardSwiperProps {
  firstName: string;
  lastName: string;
  username: string;
  degreeName?: string;
  status?: StudentCareerStatusEnum;
  picture?: string;
  hasSmartCard: boolean;
  europeanStudentCard?: EuropeanStudentCard;
  firstRequest?: boolean;
  onShowQr?: () => void;
}

type EscItem = {
  isESC: true;
  ESC: EuropeanStudentCard;
  firstRender?: boolean;
};

type SmartCardItem = {
  isESC: false;
};

type Item = EscItem | SmartCardItem;

type CarouselProps = {
  item: {
    name: string;
    lastname: string;
    username: string;
    degreeName?: string;
    status?: StudentCareerStatusEnum;
    picture?: string;
    card: Item;
  };
  index: number;
  scrollX: SharedValue<number>;
  single: boolean;
  scrollTo: (index: number, valInterval: number) => void;
  onShowQr?: () => void;
};

const SRC_WIDTH = Dimensions.get('window').width;
const CARD_LENGTH = SRC_WIDTH * 0.8;
const SPACING = SRC_WIDTH * 0.02;
const SIDECARD_LENGHT = (SRC_WIDTH - CARD_LENGTH) / 2;

const SlideItem = ({
  item,
  index,
  scrollX,
  single,
  scrollTo,
  onShowQr,
}: CarouselProps) => {
  const styles = useStylesheet(createStyles);

  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParamList>>();

  const deviceOrientation = useDeviceOrientation();

  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [
              (index - 1) * CARD_LENGTH,
              index * CARD_LENGTH,
              (index + 1) * CARD_LENGTH,
            ],
            [-CARD_LENGTH * 0.1, 0, CARD_LENGTH * 0.1],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [
              (index - 1) * CARD_LENGTH,
              index * CARD_LENGTH,
              (index + 1) * CARD_LENGTH,
            ],
            [0.8, 1, 0.8],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const { colors, palettes } = useTheme();

  return (
    <Animated.View
      accessible={false}
      style={[
        {
          width: CARD_LENGTH,
          overflow: 'hidden',
          justifyContent: 'center',
        },
        deviceOrientation === 'portrait' ? [rnAnimatedStyle] : undefined,
        !single
          ? {
              marginLeft: index === 0 ? SIDECARD_LENGHT : SPACING,
              marginRight: index === 1 ? SIDECARD_LENGHT : SPACING,
            }
          : { marginHorizontal: SIDECARD_LENGHT },
      ]}
    >
      {!item.card.isESC ? (
        <SmartCard
          width={CARD_LENGTH}
          firstName={item.name}
          lastName={item.lastname}
          username={item.username}
          degreeName={item.degreeName}
          status={item.status}
          picture={item.picture}
          onShowQr={onShowQr}
        />
      ) : (
        <View>
          <EscCard
            cognome={item.lastname.toUpperCase()}
            nome={item.name.toUpperCase()}
            matricola={item.username}
            qr={item.card.ESC.details?.qrCode ?? ''}
            cardStatus={
              item.card.ESC.canBeRequested && !item.card.ESC.details
                ? 'Requestable'
                : (item.card.ESC.details?.status ?? 'active')
            }
            expiresDate={
              item.card.ESC.details?.expiresAt
                ? DateTime.fromISO(item.card.ESC.details?.expiresAt).toFormat(
                    'dd/MM/yyyy',
                  )
                : '--/--/--'
            }
            inactiveStatusReason={item.card.ESC.details?.inactiveStatusReason}
            scrollTo={scrollTo}
          />
          {item.card.ESC.canBeRequested && !item.card.ESC.details && (
            <CtaButtonContainer absolute={true} style={styles.buttonContainer}>
              <CtaButton
                absolute={false}
                title="Request Card"
                action={() => navigation.navigate('RequestESC')}
                textStyle={{ color: colors.black, fontWeight: '600' }}
                style={styles.button}
                underlayColor={palettes.gray[200]}
                containerStyle={{
                  paddingHorizontal: isTabletHelper()
                    ? CARD_LENGTH / 3
                    : CARD_LENGTH / 6,
                }}
              />
            </CtaButtonContainer>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const CardCell = ({ children, ...props }: PropsWithChildren<ViewProps>) => (
  <View {...props} accessible={false}>
    {children}
  </View>
);

const cellRendererProps: object = {
  CellRendererComponent: CardCell,
};

export const CardSwiper = ({
  firstName,
  lastName,
  username,
  degreeName,
  status,
  picture,
  hasSmartCard,
  europeanStudentCard,
  firstRequest,
  onShowQr,
}: CardSwiperProps) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const scrollX = useSharedValue(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isFirstRequest, setIsFirstRequest] = useState<boolean>(
    firstRequest ?? false,
  );
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
      runOnJS(setCurrentPageIndex)(Math.round(e.contentOffset.x / SRC_WIDTH));
    },
  });
  const flatListRef = useRef<FlatList>(null);

  const { colors } = useTheme();

  const items: Item[] = [
    ...(hasSmartCard ? [{ isESC: false } as SmartCardItem] : []),
    ...(europeanStudentCard &&
    (europeanStudentCard.canBeRequested || europeanStudentCard.details)
      ? [
          {
            isESC: true,
            ESC: { ...europeanStudentCard },
            firstRender: isFirstRequest,
          } as EscItem,
        ]
      : []),
  ];

  const scrollTo = useCallback((index = 1, valInterval = 1000) => {
    let step = 0;
    const interval = setInterval(() => {
      if (step === 0) {
        scrollToItem(index);
      } else if (step === 1) {
        setIsFirstRequest(false);
        clearInterval(interval);
      }
      step++;
    }, valInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFirstRequest) {
      scrollTo();
    }
  }, [isFirstRequest, scrollTo]);

  const scrollToItem = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <Animated.FlatList
          ref={flatListRef}
          data={items}
          renderItem={({ item, index }) => (
            <SlideItem
              item={{
                name: firstName,
                username,
                lastname: lastName,
                degreeName,
                status,
                picture,
                card: item,
              }}
              index={index}
              scrollX={scrollX}
              single={items.length < 1}
              scrollTo={scrollTo}
              onShowQr={onShowQr}
            />
          )}
          {...cellRendererProps}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_LENGTH + SPACING * 1.5}
          pagingEnabled
          onScroll={onScrollHandler}
          initialNumToRender={3}
          disableScrollViewPanResponder={true}
          windowSize={10}
          contentContainerStyle={styles.flatListContainer}
          automaticallyAdjustContentInsets={true}
          contentInsetAdjustmentBehavior="never"
          decelerationRate={0.8}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: SRC_WIDTH,
            offset: SRC_WIDTH * index,
            index,
          })}
        />
      </View>
      <View
        style={styles.dotsContainer}
        accessible={items.length > 1}
        focusable={items.length > 1}
        accessibilityRole="adjustable"
        accessibilityLabel={t('profileScreen.cards')}
        accessibilityValue={{
          min: 1,
          max: items.length,
          now: currentPageIndex + 1,
        }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={({ nativeEvent: { actionName } }) => {
          const nextIndex =
            actionName === 'increment'
              ? Math.min(currentPageIndex + 1, items.length - 1)
              : Math.max(currentPageIndex - 1, 0);
          scrollToItem(nextIndex);
        }}
      >
        <AnimatedDotsCarousel
          length={items.length > 1 ? items?.length : 0}
          currentIndex={currentPageIndex}
          maxIndicators={items?.length ?? 0}
          activeIndicatorConfig={{
            color: colors.link,
            margin: 3,
            opacity: 1,
            size: 6,
          }}
          inactiveIndicatorConfig={{
            color: colors.heading,
            margin: 3,
            opacity: 0.5,
            size: 6,
          }}
          decreasingDots={[
            {
              config: {
                color: colors.heading,
                margin: 3,
                opacity: 0.5,
                size: 5,
              },
              quantity: 1,
            },
            {
              config: {
                color: colors.heading,
                margin: 3,
                opacity: 0.5,
                size: 4,
              },
              quantity: 1,
            },
          ]}
        />
      </View>
    </View>
  );
};

const createStyles = ({ fontWeights, colors, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      marginBottom: 20,
    },
    titleText: {
      fontSize: 14,
      lineHeight: 24,
      fontWeight: 'bold',
    },
    boxText: {
      color: colors.white,
      fontWeight: fontWeights.bold,
      fontSize: 28,
    },
    box: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatListContainer: {
      paddingVertical: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dotsContainer: {
      alignItems: 'center',
      height: 6,
    },
    buttonContainer: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
    },
    button: {
      borderColor: colors.white,
      backgroundColor: colors.white,
      paddingVertical: spacing[3],
    },
  });
