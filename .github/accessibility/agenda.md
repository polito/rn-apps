# Accessibility — Agenda section

## What has been implemented

### `AgendaCard` (base — affects all card variants)

- Single `TouchableHighlight` as the only accessible element.
- Composite `accessibilityLabel` built from type + title + time + location.
- `accessibilityRole="button"`, `accessibilityHint={t('common.tapToNavigate')}`.
- `accessibilityState={{ disabled: !onPress }}`.
- Inner `Col` has `importantForAccessibility="no-hide-descendants"` to prevent TalkBack from traversing sub-elements.

### `DeadlineCard`

- Now passes the formatted deadline date as the `time` prop to `AgendaCard` — the composite label includes the date.

### `AgendaTypeFilter`

- `accessibilityState.expanded` reflects actual open/close state (was hardcoded to `false`).
- Removed the outer `Pressable` `accessible={true}` that was creating a double-focus node.
- Decorative `faCircle` icons inside pill content have `accessible={false}`.

### `WeekFilter`

- Removed `accessible={true}` from the wrapping `Row` (was collapsing prev/next buttons into one VoiceOver node on iOS).
- Each prev/next `IconButton` has `accessibilityRole="button"`, label, `accessibilityHint`, and `accessibilityState={{ disabled }}` at boundary weeks.
- i18n keys use camelCase (`agendaScreen.previousWeek`, `agendaScreen.nextWeek`).

### `HiddenEventsScreen`

- `Checkbox` in `HiddenEventItem` receives a descriptive `text` prop built from event date + time range + course title.
- Course-name section headers have `accessibilityRole="header"`.
- Restore `CtaButton` has `accessibilityHint` and `accessibilityState={{ disabled: !hasSelectedItems }}`.

### `AgendaPreferencesScreen`

- `SwitchListItem` rows have `accessibilityLabel={course.name}`.
- Hidden-events `ListItem` has `accessibilityRole="button"`, `accessibilityHint`, and `accessibilityState={{ disabled: !hasHiddenEvents }}`.

### `BookingScreen`

- Location `ListItem` has `accessibilityHint`; virtual-place uses `accessibilityRole="link"` (not `"text"`) since pressing it navigates.
- Seat `ListItem` has `accessibilityHint`.
- Check-in and cancel `CtaButton` have `accessibilityHint` and explicit `accessibilityState={{ disabled }}`.
- Successful check-in is announced via `AccessibilityInfo.announceForAccessibility`.

### `BookingField`

- Single accessible `Col` with composite `accessibilityLabel` (`label: value`), `importantForAccessibility="no-hide-descendants"`.
- Decorative icon wrapped with shared `hideFromScreenReader`.
- Inner `Text` nodes set to `accessible={false}`.

### `BookingListItem` (Services → Bookings)

- Documented in [services.md](./services.md) — `buildCompositeListLabel`, list wrapper on `BookingsScreen`.

### `LectureScreen`

- `ListItem` elements for room and course-files have `accessibilityRole="button"` and `accessibilityLabel`.
- Destructive "Hide event" `CtaButton` has `accessibilityHint`.
- Swiper page changes trigger `AccessibilityInfo.announceForAccessibility` with the new video title.

### `AgendaWeekScreen` — shared `Calendar` component (`lib/`)

- Week event cells: `accessibilityLabel` falls back to `t('common.event')` when `item.title` is empty.
- `Calendar` scales `cellHeight` when `accessibility.fontSize >= 150` so time slots remain usable at large text sizes.
- `CalendarBody` passes `locale` to each `HourGuideCell`.
- `HourGuideCell` announces each time slot as localized weekday + hour (e.g. "Wednesday, 09:00") via `accessibilityLabel` on `TouchableWithoutFeedback`.

### Translations

- New keys added to `en.json` and `it.json`:
  - `agendaScreen.previousWeek`, `agendaScreen.nextWeek`, `agendaScreen.prevWeekHint`, `agendaScreen.nextWeekHint`
  - `hiddenEventsScreen.restoreHint`
  - `agendaPreferencesScreen.courseItem`, `agendaPreferencesScreen.hiddenEventsHint`
  - `bookingScreen.locationHint`, `bookingScreen.seatHint`, `bookingScreen.checkInHint`, `bookingScreen.cancelHint`, `bookingScreen.checkInSuccess`
  - `lectureScreen.hideEventHint`

---

## Best practices for this section

### AgendaCard composite label

Always build the label from all available contextual data — type, date, time, location:

```tsx
const label = [
  t(`agendaCard.type.${item.type}`), // "Lecture", "Booking", "Deadline"
  item.title,
  item.date ? format(item.date, 'PPP') : undefined,
  item.time,
  item.location,
]
  .filter(Boolean)
  .join(', ');
```

Hide inner layout elements:

```tsx
<TouchableHighlight
  accessibilityRole="button"
  accessibilityLabel={label}
  accessibilityHint={t('common.tapToNavigate')}
  accessibilityState={{ disabled: !onPress }}
>
  <Col importantForAccessibility="no-hide-descendants">
    {/* inner content */}
  </Col>
</TouchableHighlight>
```

### BookingField — composite read-only field

Group label and value into one focus target; hide decorative icon and duplicate text:

```tsx
<Col
  accessible
  importantForAccessibility="no-hide-descendants"
  accessibilityLabel={`${label}: ${fieldValue}`}
>
  <View
    accessible={false}
    importantForAccessibility="no-hide-descendants"
    accessibilityElementsHidden={IS_IOS}
  >
    <Icon icon={icon} />
  </View>
  {/* Prefer: <View {...hideFromScreenReader}><Icon icon={icon} /></View> */}
  <Text accessible={false}>{label}</Text>
  <Text accessible={false}>{fieldValue}</Text>
</Col>
```

### Checkbox labels in HiddenEventsScreen

Always pass the event description as the `text` prop — never leave it undefined:

```tsx
<Checkbox
  isChecked={isSelected}
  onPress={() => toggleItem(item.id)}
  text={[item.courseTitle, formatDate(item.date), item.timeRange]
    .filter(Boolean)
    .join(', ')}
/>
```

### Expandable dropdown state

`accessibilityState.expanded` must reflect actual open/close state:

```tsx
const [isOpen, setIsOpen] = useState(false);
<PillDropdownActivator
  accessibilityState={{ expanded: isOpen }}
  onPress={() => setIsOpen(p => !p)}
/>;
```

### Announcing slide/page changes

Use `AccessibilityInfo.announceForAccessibility` in a callback (not `useMemo`):

```tsx
const handlePageChange = useCallback(
  (index: number) => {
    setCurrentIndex(index);
    AccessibilityInfo.announceForAccessibility(titles[index]);
  },
  [titles],
);
```

### Calendar time slots — localized labels

Each hour cell in the week view must be individually focusable with a meaningful label:

```tsx
const accessibilityLabel = useMemo(() => {
  const dayName = date
    .setLocale(locale ?? 'en')
    .toLocaleString({ weekday: 'long' });
  const hourStr = String(hour).padStart(2, '0') + ':00';
  return `${dayName}, ${hourStr}`;
}, [date, hour, locale]);

<TouchableWithoutFeedback
  accessible={true}
  accessibilityLabel={accessibilityLabel}
  onPress={() => onPress(date.set({ hour, minute: 0 }))}
>
```

Pass `locale` from the screen through `Calendar` → `CalendarBody` → `HourGuideCell`.

### `EventInfo`

- Composite `accessibilityLabel` on the date/room row: formatted date (single events) and room name, joined with `, `.

### `DeadlineScreen`

- External link `ListItem`: `accessibilityRole="link"` and `accessibilityHint={t('common.externalLink')}`.
