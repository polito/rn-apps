# Accessibility — Tickets section

## What has been implemented

### `TicketListItem`

- Composite `accessibilityLabel`: subject (`getHtmlTextContent`), date, unread count (when > 0), position via `accessibilityListLabel(index, total)` at the **end**.
- `accessibilityRole="button"`, `accessibilityHint={t('common.tapToNavigate')}`, explicit `accessibilityState={{ disabled: isDisabled }}`.
- Close-ticket action exposed via `accessibilityActions` + `onAccessibilityAction` (reachable without long-press on screen readers).
- Decorative trailing elements (icons, unread badge, chevron) wrapped with `hideFromScreenReader` — both `importantForAccessibility="no-hide-descendants"` and `accessibilityElementsHidden={IS_IOS}`.
- Android context-menu `IconButton` is decorative only (no nested `button` role); close is on the `ListItem` via `accessibilityActions`.
- iOS: `ContextMenu` wraps the whole item for long-press close.

### `TicketsScreen`

- Removed outer `Pressable` wrapper that duplicated `accessibilityRole="button"` and caused double-focus with `TicketListItem`.
- Passes `index` and `total` into each `TicketListItem`.

### `TicketListScreen`

- Replaced bare `FlatList` with `AccessibleFlatList` (`listName` from screen title).
- Passes `index` and `total` into each `TicketListItem`.

### `TicketAttachmentChip`

- `TouchableOpacity` has `accessibilityRole="button"` and `accessibilityLabel={attachment.filename}`.

### `VirtualOperatorFeedbackBar`

- Thumbs up/down `IconButton`s have localized `accessibilityLabel`, `accessibilityRole="button"`, and `accessibilityState={{ disabled: isPending }}`.

### Translations

- New keys added to `en.json` and `it.json`:
  - `ticketsScreen.unreadCount`
  - `ticketScreen.feedbackPositive`, `ticketScreen.feedbackNegative`

---

## Best practices for this section

### ListItem with context-menu action — no nested button roles

When a `ListItem` has `accessibilityLabel`, descendants are hidden. Expose secondary actions (close ticket) on the item itself:

```tsx
<ListItem
  accessibilityRole="button"
  accessibilityLabel={ticketAccessibilityLabel}
  accessibilityActions={[{ name: 'close', label: t('tickets.close') }]}
  onAccessibilityAction={({ nativeEvent }) => {
    if (nativeEvent.actionName === 'close') onPressCloseTicket();
  }}
  trailingItem={
    <View {...hideFromScreenReader}>
      <IconButton icon={faEllipsisVertical} /> {/* visual only on Android */}
    </View>
  }
/>
```

### Decorative subtree helper

Reuse the same cross-platform hide props for every decorative icon inside a labelled `ListItem`:

```tsx
const hideFromScreenReader = {
  accessible: false as const,
  importantForAccessibility: 'no-hide-descendants' as const,
  accessibilityElementsHidden: IS_IOS,
};
```

### HTML subject lines

Always strip tags before using ticket subject in `accessibilityLabel`:

```tsx
const ticketSubject = getHtmlTextContent(ticket?.subject);
```

### Overview vs full list

- `TicketsScreen` uses `OverviewList` — position info lives on each `TicketListItem`.
- `TicketListScreen` uses `AccessibleFlatList` for list semantics and count announcement.
