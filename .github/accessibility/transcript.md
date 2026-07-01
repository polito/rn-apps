# Accessibility — Transcript section

## What has been implemented

### `ProvisionalGradeListItem`

- Composite `accessibilityLabel` via `transcriptGradesScreen.provisionalGradeItem` (course name + state) with `accessibilityListLabel(index, total)` at the **end**.
- `accessibilityRole="button"` and `accessibilityHint={t('common.tapToNavigate')}` for navigable items; rejected items use `accessibilityRole="none"` and `accessibilityState={{ disabled: true }}`.
- `ProvisionalGradeStatusBadge` wrapped with shared `hideFromScreenReader`.
- `GradesScreen` passes `index` and `total` for each provisional grade.
- Both provisional and recorded lists wrapped with `getListAccessibilityProps` (`accessibilityRole="list"`).

### `RecordedGradeListItem`

- Mirrors `ProvisionalGradeListItem`: composite label via `transcriptGradesScreen.recordedGradeItem` (course, date, credits, grade) with position at the **end**.
- Grade digit and chevron hidden from screen readers via shared `hideFromScreenReader`.
- `GradesScreen` passes `index` and `total` for each recorded grade.

### `CareerScreen`

- Removed `accessible={true}` from metric `Card` containers so individual `Metric` and chart elements remain traversable on iOS.

### `ProvisionalGradeScreen` / `RecordedGradeScreen`

- Grade value `Col` is a single accessible unit: `accessibilityLabel={t('…gradeValue', { grade })}` with inner `Text` set to `accessible={false}`.

### Translations

- New keys added to `en.json` and `it.json`:
  - `transcriptGradesScreen.gradeValue`, `transcriptGradesScreen.provisionalGradeItem`, `transcriptGradesScreen.recordedGradeItem`
  - `recordedGradeScreen.gradeValue`

---

## Best practices for this section

### Grade badge as one focus target

Do not let screen readers read the grade digit separately from its container:

```tsx
<Col
  accessible
  accessibilityLabel={t('transcriptGradesScreen.gradeValue', {
    grade: grade.grade,
  })}
>
  <Text accessible={false}>{grade.grade}</Text>
</Col>
```

### Rejected list items

Non-navigable items must not announce as buttons:

```tsx
<ListItem
  disabled={isRejected}
  accessibilityRole={isRejected ? 'none' : 'button'}
  accessibilityState={{ disabled: isRejected }}
  accessibilityHint={isRejected ? undefined : t('common.tapToNavigate')}
  linkTo={
    isRejected ? undefined : { screen: 'ProvisionalGrade', params: { id } }
  }
/>
```

### State in the accessibility label

Build labels with `buildCompositeListLabel` or manual join — position last:

```tsx
accessibilityLabel={buildCompositeListLabel(
  [t('transcriptGradesScreen.provisionalGradeItem', { courseName, state: stateLabel })],
  index,
  total,
)}
```
