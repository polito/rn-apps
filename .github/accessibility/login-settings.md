# Accessibility — Login & Settings

## What has been implemented

### `LoginScreen`

- Screen title uses `accessibilityRole="header"` (replaces invalid web-only `role="heading"`).
- Username and password `TextField`s have dedicated `accessibilityLabel` i18n keys.
- Password visibility toggle: `accessibilityRole="button"` with show/hide labels.
- "Forgot password" and SSO links: `accessibilityRole="link"`, label, and hint on the same `TouchableOpacity`; inner `Text` set to `accessible={false}`.
- Login CTA: explicit `accessibilityState={{ disabled }}` when fields are empty or loading; `accessibilityHint` explains why login is disabled.
- Dismiss-keyboard wrapper uses `accessible={false}` — does not steal focus from fields.

### `SettingsScreen`

- Theme selector (`VisualizationListItem`): `accessibilityRole="button"`, composite label with menu hint.
- Language selector: `accessibilityRole="button"`, `accessibilityState={{ disabled }}` when offline.
- Storage location (Android): composite `accessibilityLabel` with `settingsScreen.openStorageMenu`; `accessibilityState` while moving files.
- Clean cache action: `accessibilityState` when cache is empty or a download is in progress.
- MFA row: `accessibilityRole="button"`, `accessibilityHint={t('common.tapToNavigate')}`.
- Accessibility font settings row: `accessibilityRole="button"`.

### `MfaAuthContent` / `MfaEnrollContent` / `MfaSettings`

- Documented in [user.md](./user.md) — disabled CTA state/hints, MFA countdown live region, settings description label.

### `AccessibilityFontSettingsScreen`

- Custom font size picker row: composite `accessibilityLabel` (title + current value). See [user.md](./user.md).

### Translations

- New keys in `en.json` and `it.json`:
  - `loginScreen.ctaDisabledHint`, `loginScreen.forgotPasswordHint`, `loginScreen.ssoHint`
  - `settingsScreen.openStorageMenu`
  - `mfaScreen.enroll.confirmDisabledHint`

---

## Best practices for this section

### Login links — role and hint on the pressable

```tsx
<TouchableOpacity
  accessibilityRole="link"
  accessibilityLabel={t('loginScreen.forgotYourPassword')}
  accessibilityHint={t('loginScreen.forgotPasswordHint')}
  onPress={viewChpass}
>
  <Text accessible={false}>{t('loginScreen.forgotYourPassword')}</Text>
</TouchableOpacity>
```

### Disabled primary action — always explain why

```tsx
<CtaButton
  disabled={!canLogin}
  accessibilityState={{ disabled: !canLogin || isLoading }}
  accessibilityHint={!canLogin ? t('loginScreen.ctaDisabledHint') : undefined}
/>
```

### Settings menu rows — offline state

```tsx
<ListItem
  disabled={isOffline}
  accessibilityRole="button"
  accessibilityState={{ disabled: isOffline }}
  accessibilityLabel={`${t('common.language')}: ${t(`common.${language}`)}. ${t('settingsScreen.openLanguageMenu')}`}
/>
```
