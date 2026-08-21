# Accessibility — Courses section

## What has been implemented

### `CourseListItem`

- Composite `accessibilityLabel`: course name, credits, badge count, hidden state, long-press hint (iOS), with `accessibilityListLabel(index, total)` at the **end**.
- `accessibilityRole="button"`, `accessibilityLanguage` for mixed-language course titles.
- Expandable modules: chevron toggle announced via context menu on long-press; module rows use `buildCompositeListLabel` for position at the **end**.

### `CourseDirectoryListItem`

- Long-press “select all” exposed via `accessibilityActions` + `onAccessibilityAction` (maps to existing `onLongPress` handler).

### `CourseFileListItem`

- Long-press file selection exposed via `accessibilityActions` + `onAccessibilityAction` when context menu is not used for long-press.

### `CoursesScreen`

- Each teaching-period section wraps `OverviewList` in `<View {...getListAccessibilityProps(...)}>` — no `accessible={true}` on `OverviewList`.
- Section headers include item count in `accessibilityLabel`.

### `CourseNoticesScreen`

- `FlatList` uses `getListAccessibilityProps` for list semantics and count.
- Each notice row: `buildCompositeListLabel` (unread prefix, title, date; position at end), `accessibilityRole="button"`, `accessibilityHint`.
- Empty-state announcement via SR-gated `announceIfEnabled`.
- Loading via `useAnnounceLoading`.

### `CourseAssignmentsScreen` / `CourseAssignmentListItem`

- List wrapped with `getListAccessibilityProps`.
- Removed duplicate iOS `Pressable` wrapper — labels live on `FileListItem` directly.
- `CourseAssignmentListItem` uses `buildCompositeListLabel` (description, retracted state, size/date, action hints; position at end).
- Empty-state announcement via `announceIfEnabled`.

### `CourseFileListItem`

- Composite label: filename, metrics, download/open action, long-press hint on iOS.
- Download progress and trailing actions use localized `accessibilityLabel` on `IconButton`.
- Large-file download pending announced via `AccessibilityInfo.announceForAccessibility`.

### `CourseFilesScreen`

- Recent files list uses `getListAccessibilityProps` and `useAnnounceLoading`.

### `CourseInfoScreen`

- Edition selector `Metric` wrapped in `StatefulMenuView` with explicit button role on the trigger `View`.
- Staff, exams, and next-lecture sections use `OverviewList` without `accessible={true}`.
- Useful-link rows: `accessibilityRole="link"`, label from description, `accessibilityHint={t('common.externalLink')}`.

### `CourseLecturesScreen`

- Section header `Pressable`: `accessibilityRole="button"`, `accessibilityState={{ expanded: isExpanded }}`, composite label with open/closed state.

### `CourseAssignmentPdfCreationScreen`

- PDF action `TouchableHighlight`: `accessibilityRole="button"`, `accessibilityLabel`, `accessibilityState={{ disabled }}`.

### `CourseColorPickerScreen`

- Confirm CTA: `accessibilityState={{ disabled: !hasChanged }}` and `accessibilityHint={t('courseColorPickerScreen.confirmDisabledHint')}`.

### `CourseFileMultiSelectScreen`

- Modal download/remove CTAs: explicit `accessibilityState` and disabled hints (`courseFilesTab.downloadDisabledHint`, `courseFilesTab.removeDisabledHint`).

### `CourseHideEventScreen`

- Restore CTA: `accessibilityState` and `accessibilityHint={t('courseHideEventScreen.buttonDisabledHint')}` when no events are selected.

### `CourseGradesChart` / `EnrolledExamDetailChart`

- SVG chart subtree hidden with `importantForAccessibility="no-hide-descendants"`.
- Screen-reader summary via `VisuallyHidden` + i18n keys `gradesChartA11ySummary` and `enrolledExamDetailA11ySummary`.

### `CourseDirectoryScreen`

- File search results use `AccessibleFlatList` with `listName={t('common.search')}`.
- Search result count (including zero) announced via `AccessibilityInfo.announceForAccessibility`.

### `CourseColorWarningModal`

- `accessibilityViewIsModal={IS_ANDROID}` for TalkBack focus trapping.
- Switch has explicit `accessibilityLabel`.

### Translations

- Reuses existing keys: `coursesScreen.*`, `courseListItem.*`, `courseNoticesTab.*`, `courseAssignmentsTab.*`, `courseFileListItem.*`.
- New disabled-hint keys in `en.json` and `it.json`:
  - `courseColorPickerScreen.confirmDisabledHint`
  - `courseHideEventScreen.buttonDisabledHint`
  - `courseFilesTab.downloadDisabledHint`, `courseFilesTab.removeDisabledHint`
  - `courseStatisticsScreen.gradesChartA11ySummary`, `courseStatisticsScreen.enrolledExamDetailA11ySummary`

---

## Best practices for this section

### Course list — wrap, do not collapse

```tsx
<View {...getListAccessibilityProps(sectionTitle, courses.length)}>
  <OverviewList indented>
    {courses.map((course, index) => (
      <CourseListItem
        key={course.id}
        course={course}
        index={index}
        total={courses.length}
      />
    ))}
  </OverviewList>
</View>
```

### Notice / assignment list items — position at the end

```tsx
accessibilityLabel={buildCompositeListLabel(
  [unreadPrefix, title, dateLabel].filter(Boolean),
  index,
  total,
)}
```

### File list items — lift all interactivity to `ListItem`

Do not nest pressable download buttons inside a labeled `FileListItem` without exposing them via `accessibilityActions`. Trailing `IconButton`s must have their own `accessibilityLabel`.

### HTML in notices

Strip tags before using notice content in labels:

```tsx
title: getHtmlTextContent(notice.content);
```
