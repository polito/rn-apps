# Course Files Refactor — Implementation Changes

## Overview

Implemented a full refactor of the Faculty course-files flow from a Teaching-screen-centric structure into a feature-oriented module under `faculty/src/features/files`.

This change set introduces:

1. Feature-oriented file architecture under `faculty/src/features/files`
2. New screens for directory browsing, multi-select, move, upload, and edit flows
3. New reusable UI components and file-management hooks
4. Navigation updates to route through the new feature module
5. New i18n strings and supporting assets

---

## Core Flow Changes

### `faculty/src/features/files/screens/CourseFilesScreen.tsx`

- Replaces the old Teaching tab screen and becomes the main entry for course file browsing.
- Integrates feature hooks/utilities for normalized file entries and action handling.
- Serves as the launch point for downstream actions (open directory, move, upload, modify, multi-select).

### `faculty/src/features/files/screens/CourseDirectoryScreen.tsx` _(new)_

- Adds dedicated directory-level navigation instead of keeping all logic in one screen.
- Separates hierarchical browsing concerns from list-item UI and action menus.

### `faculty/src/features/files/screens/MoveFilesScreen.tsx` _(new)_

- Introduces a focused move flow for selected file entries.
- Works with the new typed file entry model and feature utilities to resolve source/destination paths.

### `faculty/src/features/files/screens/CourseFileMultiSelectScreen.tsx` _(new)_

- Adds explicit multi-select workflow for batch operations.
- Coordinates checkbox state and action menus through reusable shared components.

### `faculty/src/features/files/screens/CourseFilesUploadScreen.tsx` _(new)_

- Adds upload-specific screen so upload behavior is isolated from browse/edit UI.
- Enables cleaner future handling of file validation, errors, and quota responses.

### `faculty/src/features/files/screens/ModifyFileScreen.tsx`

- Migrated from Teaching folder and updated to align with new feature routes and typed file entities.
- Keeps single-file edit/rename behavior in the feature domain.

---

## Shared UI / Hook Layer

### Core reusable components

- `faculty/src/core/components/Checkbox.tsx`
- `faculty/src/core/components/CourseFilesContextMenu.tsx`
- `faculty/src/core/components/CourseFilesMenu.tsx`
- `faculty/src/core/components/SearchBar.tsx`

These components centralize interaction patterns used across browse and multi-select flows.

### Feature components

- `faculty/src/features/files/components/CourseFilesList.tsx`
- `faculty/src/features/files/components/CourseFileListItem.tsx`
- `faculty/src/features/files/components/CourseDirectoryListItem.tsx`
- `faculty/src/features/files/components/CreateFolderIcon.tsx`

These split list rendering responsibilities from screen orchestration, reducing screen complexity.

### Data / state hooks

- `faculty/src/core/queries/fileHooks.ts`
- `faculty/src/features/files/hooks/useCourseFilesCachePath.ts`
- `faculty/src/features/files/hooks/useCourseFilesData.ts`
- `faculty/src/features/files/hooks/useFileManagement.ts`

These hooks isolate file cache path logic, loading/refresh behavior, and management actions.

---

## Navigation / Route Integration

### `faculty/src/core/types/navigation.ts`

- Extended route typing to include the new files feature screens and params.

### Teaching navigators

- `faculty/src/screens/Teaching/CourseNavigator.tsx`
- `faculty/src/screens/Teaching/CourseSharedScreens.tsx`
- `faculty/src/screens/Teaching/TeachingNavigator.tsx`
- `faculty/src/features/files/navigation/FileNavigator.tsx` _(new)_
- `faculty/src/features/files/screens/index.ts` _(new)_

Result: file-related routes are now defined as a coherent feature navigation surface instead of ad-hoc Teaching-only bindings.

---

## Files Created

### Assets

- `faculty/assets/icons/assets/create-folder-icon.svg`

### Core UI and query utilities

- `faculty/src/core/components/Checkbox.tsx`
- `faculty/src/core/components/CourseFilesContextMenu.tsx`
- `faculty/src/core/components/CourseFilesMenu.tsx`
- `faculty/src/core/components/SearchBar.tsx`
- `faculty/src/core/queries/fileHooks.ts`

### Feature components

- `faculty/src/features/files/components/CourseFilesList.tsx`
- `faculty/src/features/files/components/CreateFolderIcon.tsx`

### Feature errors

- `faculty/src/features/files/errors/FileQuotaExceededError.ts`
- `faculty/src/features/files/errors/FileUploadError.ts`
- `faculty/src/features/files/errors/UnsupportedFileTypeError.ts`

### Feature hooks

- `faculty/src/features/files/hooks/useCourseFilesCachePath.ts`
- `faculty/src/features/files/hooks/useCourseFilesData.ts`
- `faculty/src/features/files/hooks/useFileManagement.ts`

### Feature navigation and screens

- `faculty/src/features/files/navigation/FileNavigator.tsx`
- `faculty/src/features/files/screens/CourseDirectoryScreen.tsx`
- `faculty/src/features/files/screens/CourseFileMultiSelectScreen.tsx`
- `faculty/src/features/files/screens/CourseFilesUploadScreen.tsx`
- `faculty/src/features/files/screens/MoveFilesScreen.tsx`
- `faculty/src/features/files/screens/index.ts`

### Feature types and utils

- `faculty/src/features/files/types/Directory.ts`
- `faculty/src/features/files/types/FileEntry.ts`
- `faculty/src/features/files/utils/fs-entry.ts`

---

## Files Renamed / Relocated

- `faculty/src/screens/Teaching/CourseDirectoryListItem.tsx` -> `faculty/src/features/files/components/CourseDirectoryListItem.tsx`
- `faculty/src/screens/Teaching/CourseFileListItem.tsx` -> `faculty/src/features/files/components/CourseFileListItem.tsx`
- `faculty/src/screens/Teaching/CourseFilesTab.tsx` -> `faculty/src/features/files/screens/CourseFilesScreen.tsx`
- `faculty/src/screens/Teaching/ModifyFileScreen.tsx` -> `faculty/src/features/files/screens/ModifyFileScreen.tsx`
- `faculty/src/screens/Teaching/files.ts` -> `faculty/src/features/files/utils/files.ts`

---

## Files Modified

### Configuration / dependencies

- `.vscode/settings.json`
- `faculty/package.json`
- `faculty/ios/Podfile.lock`
- `package-lock.json`

### Translations

- `faculty/assets/translations/en.json`
- `faculty/assets/translations/it.json`

Added/updated strings for the moved and new files screens, menus, and actions to keep i18n coverage complete in both languages.

### Navigation and typing

- `faculty/src/core/types/navigation.ts`
- `faculty/src/screens/Teaching/CourseNavigator.tsx`
- `faculty/src/screens/Teaching/CourseSharedScreens.tsx`
- `faculty/src/screens/Teaching/TeachingNavigator.tsx`

### Files feature screens/components (updated after move)

- `faculty/src/features/files/components/CourseFileListItem.tsx`
- `faculty/src/features/files/screens/CourseFilesScreen.tsx`
- `faculty/src/features/files/screens/ModifyFileScreen.tsx`

---

## Files Removed

- `faculty/src/screens/Teaching/CourseFilesCacheContext.ts`
- `faculty/src/screens/Teaching/FilesFormScreen.tsx`

---

## Architectural Rules Followed

| Rule                          | How applied                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature-first structure       | Files-domain logic moved from `screens/Teaching` into `features/files` with dedicated `components`, `hooks`, `navigation`, `screens`, `types`, and `utils` |
| Separation of concerns        | Screens orchestrate flow, reusable components handle UI patterns, hooks/utilities own data/path logic                                                      |
| Typed navigation contracts    | Route params and screen names centralized through `core/types/navigation.ts` and feature navigator exports                                                 |
| Backward-compatible migration | Legacy Teaching files screens replaced via route rewiring rather than changing unrelated domains                                                           |
| Localized user-facing strings | New/updated labels and actions added in both `en.json` and `it.json`                                                                                       |
| Explicit error modeling       | File-domain failures represented via dedicated error classes (`FileUploadError`, `FileQuotaExceededError`, `UnsupportedFileTypeError`)                     |

---

## Data Model — Relation Map

```text
Course (Teaching domain)
 └── Files feature entrypoint (navigator route + course context)
      │
      ▼
CourseFilesScreen
 ├── useCourseFilesCachePath()   -> resolves local cache/storage root
 ├── useCourseFilesData()        -> loads and normalizes entries
 ├── useFileManagement()         -> create/move/rename/delete actions
 └── CourseFilesList
      ├── CourseDirectoryListItem -> directory row rendering
      └── CourseFileListItem      -> file row rendering

File entities (features/files/types)
 ├── Directory
 └── FileEntry
      │
      ▼
Utilities (features/files/utils)
 ├── fs-entry.ts  -> fs object mapping/normalization helpers
 └── files.ts     -> file operation helpers (migrated from Teaching)

Action surfaces
 ├── CourseFilesMenu / CourseFilesContextMenu
 ├── CourseFileMultiSelectScreen (batch selections)
 ├── MoveFilesScreen (destination selection + move)
 ├── ModifyFileScreen (single item edit flow)
 └── CourseFilesUploadScreen (upload flow + validation/error handling)
```
