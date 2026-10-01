# Accessibility — Services section

## What has been implemented

### `ServiceCard`

- Removed `accessibilityRole="button"` from the inner `Row` — it competed with `TouchableCard`'s button role and caused VoiceOver on iOS to misroute focus (navigate vs toggle favorite).
- `TouchableCard` keeps `accessibilityRole="button"` for navigation.
- Favorite `IconButton` has localized `accessibilityLabel`:
  - `servicesScreen.favoriteActive` — "Remove from favorites"
  - `servicesScreen.favoriteInactive` — "Add to favorites"
- `hitSlop={uniformInsets(16)}` on the favorite button for adequate touch target.

### `ServicesScreen`

- Each service tile passes a composite `accessibilityLabel` built from title and unread badge count where applicable.
- Grid layout adapts card width when system font size is increased (`accessibility.fontSize`).

### `NewsListItem`

- `accessibilityRole="button"` with `buildCompositeListLabel` (title, unread, subtitle; position at end).
- Decorative chevron hidden via `hideFromScreenReader`.

### `NewsScreen`

- `OverviewList` wrapped with `getListAccessibilityProps` for list semantics and item count.

### `BookingsScreen` / `BookingListItem`

- `BookingsScreen` wraps `OverviewList` with `getListAccessibilityProps`.
- `BookingListItem` uses `buildCompositeListLabel` (title, date, time range; position at end), `accessibilityRole="button"`, and `accessibilityHint`.
- Empty-state announcement uses SR-gated `setTimeoutAccessibilityInfoHelper`.

### `BookingTopicScreen`

- Expandable section headers: `accessibilityRole="button"`, `accessibilityState={{ expanded }}`, composite label with open/closed state.
- Subtopic rows: `buildCompositeListLabel`, `accessibilityRole="button"`, `accessibilityHint`.

### `BookingSlotScreen`

- Calendar slot `Pressable`s and `AgendaCard` rows use status + time in `accessibilityLabel`.
- Week navigation reuses `WeekFilter` patterns from [agenda.md](./agenda.md).

### `BookingSeatScreen` / `BookingSeatSelectionScreen`

- `ReactNativeZoomableView` set to `accessible={false}` — individual `BookingSeatCell` elements remain focusable.
- `BookingSeatCell`: `accessibilityState={{ disabled }}` for unavailable seats.
- `BookingDeskCell`: labeled desk landmark.
- Cancel CTA: explicit `accessibilityState` and offline `accessibilityHint`.
- `BookingSeatsCta`: confirm CTA has `accessibilityState={{ disabled: !ctaEnabled }}` and `accessibilityHint={t('bookingSeatScreen.confirmDisabledHint')}` when seat selection is required but missing.

### `NewsItemScreen`

- Removed invalid `accessibilityRole="text"` from event date row.
- `HtmlView` body: `accessibilityLabel={getHtmlTextContent(...)}` with `importantForAccessibility="no-hide-descendants"`.
- Information section heading: `accessibilityRole="header"`.
- Link/file rows: `accessibilityRole="link"`, label, hint, decorative icons hidden via `hideFromScreenReader`.

### `TicketsScreen` (under Services navigation)

- Documented in [tickets.md](./tickets.md) — ticket list items, `AccessibleFlatList`, feedback bar.

### `JobOffersScreen` / `JobOfferListItem` / `JobOfferScreen`

- Documented in [job-offers.md](./job-offers.md) — listed here because they live under Services navigation.

### Translations

- New keys added to `en.json` and `it.json`:
  - `servicesScreen.favoriteActive`
  - `servicesScreen.favoriteInactive`
  - `newsScreen.openLink`, `newsScreen.openFile`
  - `bookingTopicScreen.selectTopicHint`
  - `bookingScreen.cancelDisabledHint`
  - `bookingSeatScreen.confirmDisabledHint`

---

## Best practices for this section

### Card with secondary action — no nested button roles

When a card navigates and contains a separate action (favorite, menu, etc.), only the outer navigable container should declare `accessibilityRole="button"`. Inner action controls keep their own semantics.

```tsx
// WRONG — VoiceOver focus is unreliable on iOS
<TouchableCard accessibilityRole="button" onPress={navigate}>
  <Row accessibilityRole="button">
    <IconButton
      accessibilityLabel={t('servicesScreen.favoriteInactive')}
      onPress={toggleFavorite}
    />
  </Row>
</TouchableCard>

// CORRECT
<TouchableCard accessibilityRole="button" onPress={navigate} accessibilityLabel={label}>
  <Row>
    <IconButton
      accessibilityLabel={
        favorite
          ? t('servicesScreen.favoriteActive')
          : t('servicesScreen.favoriteInactive')
      }
      onPress={toggleFavorite}
      hitSlop={uniformInsets(16)}
    />
  </Row>
</TouchableCard>
```

### Service tile labels

Build labels from visible title and unread state — never hardcode English:

```tsx
accessibilityLabel={`${t('ticketsScreen.title')} ${
  unreadCount > 0 ? t('servicesScreen.newElement') : ''
}`}
```

### List items under Services

Prefer `buildCompositeListLabel`; otherwise put `accessibilityListLabel` at the **end**:

```tsx
accessibilityLabel={buildCompositeListLabel([title, subTitle], index, total)}
```
