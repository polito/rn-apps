# Accessibility — User / Profile section

## What has been implemented

### `UserQrModal`

- Modal title wrapped in accessible `View` with `accessibilityRole="header"` and i18n label `userQrModal.studentIdentity` (first name, last name, student ID).
- Child `Text` nodes set to `accessible={false}` so iOS reads one composite heading.
- Focus moves to the header on open (`setAccessibilityFocus` after 100 ms animation delay).
- `accessibilityViewIsModal={IS_ANDROID}` on the modal container for TalkBack focus trapping.

### `MessagesScreen`

- Swipe-to-delete action button has `accessibilityRole="button"` and `accessibilityLabel={t('messagesScreen.deleteMessage')}`.
- List wrapped with `getListAccessibilityProps` for list semantics and item count.

### `MessageListItem`

- Composite `accessibilityLabel` with title and sent date; list position appended at the **end** via `buildCompositeListLabel`.
- `accessibilityRole="button"` and `accessibilityHint={t('common.tapToNavigate')}`.

### `ProfileScreen`

- Career row uses `accessibilityRole="none"` (not invalid `"text"`) when switching careers is unavailable.
- Degree `ListItem`: `accessibilityRole="button"`, composite `accessibilityLabel` (degree name, level, enrollment year).
- Notifications, Settings, and Messages rows: `accessibilityRole="button"` and explicit `accessibilityLabel`.

### `CareerStatus`

- Decorative status dot `View` wrapped with `hideFromScreenReader`.

### `EscInfoBottomModal`

- Info `Icon` container uses `hideFromScreenReader`.

### `MfaAuthContent`

- Allow/deny CTAs: `accessibilityState={{ disabled: isPending }}`.
- Countdown `Text`: `accessibilityLiveRegion="polite"` for timer updates.

### `MfaEnrollContent`

- Confirm CTA: `accessibilityState={{ disabled: deviceName.length === 0 }}` and `accessibilityHint={t('mfaScreen.enroll.confirmDisabledHint')}`.

### `MfaSettings`

- Information block `View`: `accessible` with `accessibilityLabel={t('mfaScreen.settings.description')}`.

### `AccessibilityFontSettingsScreen`

- Custom font size menu row: `accessibilityLabel` with title and current value.

### `NotificationsScreen`

- Ticket and booking `SwitchListItem` rows: explicit `accessibilityLabel`.

### `RequestESCScreen`

- Bullet characters hidden via `hideFromScreenReader`; list item text keeps individual `accessibilityLabel`.
- Request card: composite `accessibilityLabel` from i18n section strings.

### `UnreadMessagesModal`

- Next `CtaButton` (icon-only): `accessibilityLabel={t('common.next')}`.

### Translations

- New keys added to `en.json` and `it.json`:
  - `userQrModal.studentIdentity`
  - `messagesScreen.deleteMessage`
  - `mfaScreen.enroll.confirmDisabledHint`

---

## Best practices for this section

### Custom modal — focus and Android trapping

`UserQrModal` uses `react-native-modal`, not `BottomModal`. Apply both patterns manually:

```tsx
const headerRef = useRef<View>(null);

useLayoutEffect(() => {
  if (!visible) return;
  const timer = setTimeout(() => {
    const node = findNodeHandle(headerRef.current);
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  }, 100);
  return () => clearTimeout(timer);
}, [visible]);

<View accessibilityViewIsModal={IS_ANDROID} /* modal content */>
  <View ref={headerRef} accessible accessibilityRole="header" accessibilityLabel={t('userQrModal.studentIdentity', { ... })}>
    <Text accessible={false}>…</Text>
  </View>
</View>
```

### Composite list item labels

```tsx
const { buildCompositeListLabel } = useAccessibility();

accessibilityLabel={buildCompositeListLabel(
  [title, t('messagesScreen.sentAt') + ' ' + sentAt],
  index,
  totalData,
)}
```

### No hardcoded accessibility strings

```tsx
// WRONG
accessibilityLabel={`${student.nome} ${student.cognome}, ${student.matricola}`}

// CORRECT
accessibilityLabel={t('userQrModal.studentIdentity', {
  firstName: student?.nome ?? '',
  lastName: student?.cognome ?? '',
  studentId: student?.matricola ?? '',
})}
```
