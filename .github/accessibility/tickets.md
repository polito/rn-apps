# Accessibility — Tickets section

## What has been implemented

### `TicketListItem`

- Composite `accessibilityLabel`: subject (`getHtmlTextContent`), date, unread count (when > 0), position via `accessibilityListLabel(index, total)` at the **end**.
- `accessibilityRole="button"`, `accessibilityHint={t('common.tapToNavigate')}`, explicit `accessibilityState={{ disabled: isDisabled }}`.
- Close-ticket action exposed via `accessibilityActions` + `onAccessibilityAction` (reachable without long-press on screen readers).
- Decorative trailing elements (icons, unread badge, chevron) wrapped with shared `hideFromScreenReader` from `students/src/core/accessibility/hideFromScreenReader.ts`.
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

### `TicketFaqsScreen`

- FAQ results wrapped with `getListAccessibilityProps`; position at end of each row label.
- Leading question icon wrapped with `hideFromScreenReader`.
- Empty search results announced via `announceIfEnabled` (SR-gated).

### `ChatMessage` / `TicketScreen` (request bubble)

- Removed invalid `accessibilityRole="text"`; message content announced via `accessibilityLabel` on `ChatBubble` only.
- Outer `Pressable` set to `accessible={false}` to avoid duplicate focus targets.

### `TicketStatusInfo`

- Removed invalid `accessibilityRole="text"` from metric rows; each `Metric` keeps its own `accessibilityLabel`.

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

Import the shared constant — do not copy-paste inline props:

```tsx
import { hideFromScreenReader } from '~/core/accessibility/hideFromScreenReader';

<View {...hideFromScreenReader}>
  <Icon icon={faPaperclip} />
</View>;
```

### HTML subject lines

Always strip tags before using ticket subject in `accessibilityLabel`:

```tsx
const ticketSubject = getHtmlTextContent(ticket?.subject);
```

### Overview vs full list

- `TicketsScreen` uses `OverviewList` — position info lives on each `TicketListItem`.
- `TicketListScreen` uses `AccessibleFlatList` for list semantics and count announcement.
