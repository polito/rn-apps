# Accessibility Documentation

This folder documents what has been implemented for assistive-technology accessibility across each section of the app.

## Sections

| Section            | File                                     |
| ------------------ | ---------------------------------------- |
| Teaching + Surveys | [teaching.md](./teaching.md)             |
| Agenda             | [agenda.md](./agenda.md)                 |
| Offering           | [offering.md](./offering.md)             |
| Contacts           | [contacts.md](./contacts.md)             |
| Job Offers         | [job-offers.md](./job-offers.md)         |
| Guides             | [guides.md](./guides.md)                 |
| Services           | [services.md](./services.md)             |
| Tickets            | [tickets.md](./tickets.md)               |
| Transcript         | [transcript.md](./transcript.md)         |
| User / Profile     | [user.md](./user.md)                     |
| Courses            | [courses.md](./courses.md)               |
| Login & Settings   | [login-settings.md](./login-settings.md) |

## Cross-cutting rules

These patterns affect every section and must be followed consistently.

### 1. Never pass `accessible={true}` to `OverviewList`

`OverviewList` internally sets `accessible={Platform.select({ android: true, ios: false })}` to keep items individually navigable on iOS. Any caller that passes `accessible={true}` overrides this via `{...rest}` spread, collapsing the entire list into a single VoiceOver element.

```tsx
// WRONG — collapses all list items on iOS
<OverviewList accessible={true} accessibilityRole="list" accessibilityLabel={label}>
  {items.map(item => <MyListItem key={item.id} {...item} />)}
</OverviewList>

// CORRECT — wrap in a View for list semantics
<View accessibilityRole="list" accessibilityLabel={label}>
  <OverviewList>
    {items.map(item => <MyListItem key={item.id} {...item} />)}
  </OverviewList>
</View>
```

### 2. `accessibilityRole="text"` is not a valid React Native role

React Native does not recognise `"text"` as an accessibility role — it is silently ignored. Use `"none"` for containers with no interactivity, or omit the role entirely for plain text elements.

### 3. `accessible={true}` on a container kills child role semantics on iOS

When a parent `View` has `accessible={true}`, iOS makes it a single leaf element. Any `accessibilityRole`, `accessibilityLabel`, or `onPress` on children are silently discarded. Only use `accessible={true}` on containers with purely decorative children.

### 4. `ListItem` + `accessibilityLabel` hides all descendants

`ListItem` sets `importantForAccessibility="no-hide-descendants"` on its inner View whenever an `accessibilityLabel` prop is present. Any interactive child (e.g. a copy `TouchableOpacity`) becomes unreachable. Lift all interactivity to the `ListItem` itself (via `onPress`, `accessibilityActions`).

### 5. `accessibilityState.disabled` must be explicit

Passing `disabled` to `TouchableHighlight` / `TouchableOpacity` does not reliably set `accessibilityState.disabled` on all React Native versions. Always set it explicitly:

```tsx
<ListItem disabled={isOffline} accessibilityState={{ disabled: isOffline }} />
```

### 6. Error and validation texts need `accessibilityLiveRegion`

```tsx
{
  isError && (
    <Text
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      style={styles.error}
    >
      {t('form.fieldRequired')}
    </Text>
  );
}
```

### 7. Position info at the end of composite labels

`accessibilityListLabel` returns a string ending in `. `. Placing it first creates a `". ,"` double-pause cadence.

**Prefer `buildCompositeListLabel`** from `useAccessibility` — it joins content parts and appends position at the end automatically:

```tsx
const { buildCompositeListLabel } = useAccessibility();

const label = buildCompositeListLabel([title, subtitle], index, total);
```

Manual assembly is also valid:

```tsx
// WRONG
[accessibilityListLabel(index, total), title, subtitle]
  .join(', ')

  [
    // CORRECT — position at the end
    (title, subtitle, accessibilityListLabel(index, total))
  ].filter(Boolean)
  .join(', ');
```

> **Do not use `accessibilityListLabel(index, total, extraText)`** to pass row content — the third argument is appended after the position string, which still puts position first.

### 8. Do not nest `accessibilityRole="button"` inside another button

Two nested button roles cause VoiceOver on iOS to misroute focus. Keep `accessibilityRole="button"` only on the outer navigable container (e.g. `TouchableCard`); inner actions like `IconButton` keep their own label but must not sit inside another element that also declares `button`. See [services.md](./services.md).

## App-specific utilities quick reference

| Need                          | Use                                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| List with item count          | `getListAccessibilityProps` from `useAccessibility`, `AccessibleFlatList`, or `<View accessibilityRole="list">` |
| List item position ("X of Y") | `buildCompositeListLabel(parts, index, total)` or `accessibilityListLabel(index, total)` at the **end**         |
| Hide decorative elements      | `hideFromScreenReader` from `students/src/core/accessibility/hideFromScreenReader.ts`                           |
| Badge count                   | `getBadgeAccessibilityLabel` from `useAccessibility`                                                            |
| Loading announcement          | `announceLoading` / `useAnnounceLoading` from `useAccessibility`                                                |
| Conditional announcement      | `announceIfEnabled` from `useAccessibility` (or SR-gated `setTimeoutAccessibilityInfoHelper`)                   |
| Screen reader detection       | `useScreenReader().isEnabled` — listens to `screenReaderChanged` for live updates                               |
| Mixed IT/EN text              | `AccessibleText` / `MultiLingualText` from `students/src/core/components/AccessibleText.tsx`                    |
| Screen-reader-only content    | `VisuallyHidden` from `@polito/lib/ui`                                                                          |
| Platform conditionals         | `IS_IOS`, `IS_ANDROID` from `students/src/core/constants.ts`                                                    |
| Long-press via screen reader  | `accessibilityActions` + `onAccessibilityAction` on the same element as `onLongPress`                           |
| Disabled CTA hint             | `accessibilityHint` when `accessibilityState.disabled` is true and the reason is not obvious                    |
| External URL rows             | `accessibilityRole="link"` + `accessibilityHint={t('common.externalLink')}`                                     |
| Strip HTML for labels         | `getHtmlTextContent` from `src/utils/html`                                                                      |

Full guide: [`docs/Accessibility-best-practice.md`](../../docs/Accessibility-best-practice.md) (English) · [`docs/best-practise-accessibilita.md`](../../docs/best-practise-accessibilita.md) (Italian)
