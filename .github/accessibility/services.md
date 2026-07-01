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

- `accessibilityRole="button"` with composite label: title + subtitle + position.
- Position info from `accessibilityListLabel(index, totalData)` at the **end**.

### `TicketsScreen` (under Services navigation)

- Documented in [tickets.md](./tickets.md) — ticket list items, `AccessibleFlatList`, feedback bar.

### `JobOffersScreen` / `JobOfferListItem` / `JobOfferScreen`

- Documented in [job-offers.md](./job-offers.md) — listed here because they live under Services navigation.

### Translations

- New keys added to `en.json` and `it.json`:
  - `servicesScreen.favoriteActive`
  - `servicesScreen.favoriteInactive`

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

Use `accessibilityListLabel` at the **end** of composite labels:

```tsx
accessibilityLabel={[title, subTitle, accessibilityListLabel(index, total)].join(', ')}
```
