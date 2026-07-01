# Accessibility — Teaching section

## What has been implemented

### `ExamRequestScreen` / `ExamRescheduleComponent`

- `TextField` elements have `accessibilityLabel` (from the field label) and `accessibilityHint` (from the section title).
- Error `<Text>` elements now have `accessibilityLiveRegion="assertive"` and `accessibilityRole="alert"` so screen readers announce validation errors immediately.

### `Checkbox` (shared component)

- `accessibilityRole="checkbox"`, `accessibilityState={{ checked, disabled }}`, `accessibilityLabel={accessibilityLabel ?? text}`.
- Optional `accessibilityLabel` prop overrides visible `text` when the label needs more context.

### `useScreenReader` (shared hook)

- Subscribes to `AccessibilityInfo` `screenReaderChanged` so `isEnabled` updates when the user toggles VoiceOver/TalkBack without restarting the app.

### `ProgressChart`

- `accessibilityRole="progressbar"`, `accessibilityLabel`, `accessibilityValue`, `focusable={true}`.
- Multi-ring labels use `t('common.progressChartMulti')` to describe all data points.
- Each `RNCKProgressChart` SVG wrapped in `<View importantForAccessibility="no-hide-descendants">` to suppress TalkBack traversal on Android.
- Fallback label uses `t('common.progressChart')` (no more hardcoded English string).

### `ExamCTA` / `ExamRescheduleCTA`

- Status-specific `accessibilityHint` per exam state (not available, requestable, bookable, booked/cancel).
- `ExamRescheduleScreen` CTA has `accessibilityHint={t('examRescheduleScreen.ctaDisabledHint')}` explaining why it is disabled.

### `ExamListItem`

- Small-font path: date and location rows have `accessible={true}` and composite `accessibilityLabel`.
- Large-font path (fontSize ≥ 175): same grouping now applied — date row and location/status row both have `accessibilityLabel`.
- When `index` and `total` are provided, list position is appended at the **end** of the composite label (not prefixed).

### `RadioGroup` (shared component)

- Removed `accessible={true}` from the `Col` (was collapsing all radio buttons into one inaccessible node).
- Added `<View accessibilityRole="radiogroup">` wrapper so each radio item remains individually focusable.
- Validation error `Text` has `accessibilityLiveRegion="assertive"` and `accessibilityRole="alert"`.

### `SurveyCategoryListItem`

- `accessibilityRole="button"` and `accessibilityHint={t('common.tapToNavigate')}`.
- Composite `accessibilityLabel`: category name, pending count (`surveysScreen.remainingCount`), position via `accessibilityListLabel(index, total)` at the **end**.
- `SurveyTypesSection` passes `index` and `total` from the `types.map` callback.

### `SurveyListItem` / `SurveyListItemByTypeName`

- `accessibilityRole="button"` and `accessibilityHint={t('surveysScreen.tapToOpenSurvey')}`.
- `SurveyListScreen` passes composite `accessibilityLabel` via `buildCompositeListLabel` (title, subtitle, position at end).
- `SurveyListItemByTypeName` combines survey title with type name so items are distinguishable.

### `CpdSurveysScreen`

- Position info and survey title combined: `` `${survey.title}, ${accessibilityListLabel(index, surveys.length)}` `` — position no longer replaces the title.

### `SurveysScreen`

- `IncompleteSurveys` and `CompiledSurveys` moved to module scope (no longer redefined on every parent render — prevents focus reset on VoiceOver/TalkBack).
- Incomplete surveys `SectionHeader` includes pending count in `accessibilityLabel`.

### `SurveyListScreen`

- `FlatList` has `accessibilityRole="list"` and count label.
- Each row receives `accessibilityLabel` from `buildCompositeListLabel([title, subtitle], index, total)`.

> **Note:** empty-state copy still uses legacy `ticketsScreen.*` keys — fixing that is a separate non-a11y bug fix.

### `ExamCpdModalContent`

- `faWarning` icon wrapped in `<View importantForAccessibility="no" accessibilityElementsHidden={true}>` — no longer read by screen readers.

### `ModalContent` (shared component)

- Modal title `Text` has `accessibilityRole="header"`.

### `BottomModal` (shared component)

- Inner wrapper `View` has `accessibilityViewIsModal={true}` on Android — TalkBack focus is now trapped inside the modal.

### `TeachingScreen`

- Rich composite labels on Courses and Exams section headers (title + total + hidden count).
- Transcript `TouchableHighlight` with full grade metrics in label.
- `AccessibilityInfo.announceForAccessibility` on grade-visibility toggle.
- Platform-split iOS/Android implementation.

### Translations

- New keys added to `en.json` and `it.json`:
  - `examRescheduleScreen.ctaDisabledHint`
  - `common.progressChart`, `common.progressChartMulti`
  - `surveysScreen.tapToOpenSurvey`, `surveysScreen.surveysList`, `surveysScreen.remainingCount`

---

## Best practices for this section

### Error and validation messages

Always pair inline errors with live region announcements:

```tsx
{
  state.isError && (
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

### Bottom modals — focus management

After opening any `BottomModal`, move focus to the first interactive element:

```tsx
const firstRef = useRef<View>(null);
useLayoutEffect(() => {
  if (isOpen) {
    AccessibilityInfo.setAccessibilityFocus(findNodeHandle(firstRef.current)!);
  }
}, [isOpen]);
```

`BottomModal` already adds `accessibilityViewIsModal={true}` on Android for focus trapping.

### Survey list items

Every `SurveyListItem` and `SurveyCategoryListItem` gets role, hint, and a label that includes the item's own title — never replace the title with a position-only string. Prefer `buildCompositeListLabel`; position always goes at the **end**:

```tsx
// SurveyCategoryListItem — position at the end
accessibilityLabel={buildCompositeListLabel(
  [type.name, t('surveysScreen.remainingCount', { count: type.incompleteCount })],
  index,
  total,
)}
```

### RadioGroup

`RadioGroup` does NOT use `accessible={true}` on the container. Each radio item needs individual focus. The container has `accessibilityRole="radiogroup"` only for grouping semantics.

### Disabled CTA buttons

Always explain why a CTA is disabled:

```tsx
<CtaButton
  disabled={!isReady}
  accessibilityHint={
    !isReady ? t('examRescheduleScreen.ctaDisabledHint') : undefined
  }
/>
```
