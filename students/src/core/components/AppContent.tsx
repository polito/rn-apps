import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo } from 'react-native';

import { usePreferencesContext, useSplashContext } from '@polito/lib/core';
import { BottomModal, useBottomModal } from '@polito/lib/ui';
import { useQueryClient } from '@tanstack/react-query';

import { useApiContext } from '../contexts/ApiContext';
import { useCheckForUpdate } from '../hooks/useCheckForUpdate';
import { MigrationService } from '../migrations/MigrationService';
import { DownloadsProvider } from '../providers/DownloadsProvider';
import { AppPreferences } from '../types/preferences';
import { GuestNavigator } from './GuestNavigator';
import { NewVersionModal } from './NewVersionModal';
import { RootNavigator } from './RootNavigator';

const LOADING_ANNOUNCEMENT_DELAY = 600;

export const AppContent = () => {
  const { t } = useTranslation();
  const { isLogged } = useApiContext();
  const preferences = usePreferencesContext<AppPreferences>();
  const queryClient = useQueryClient();
  const { isSplashLoaded } = useSplashContext();
  const needsMigration = MigrationService.needsMigration(preferences);

  const {
    close: closeModal,
    open: showModal,
    modal: bottomModal,
  } = useBottomModal();
  const { needsUpdate, version, url, source } = useCheckForUpdate();
  const [versionModalVisible, setVersionModalVisible] = useState<
    boolean | undefined
  >();

  useEffect(() => {
    if (!isSplashLoaded) return;
    if (needsUpdate === false) {
      setVersionModalVisible(false);
      return;
    }
    if (
      needsUpdate === undefined ||
      version === undefined ||
      url === undefined ||
      source === undefined
    )
      return;
    setVersionModalVisible(true);
    showModal(
      <NewVersionModal
        close={closeModal}
        newVersion={version}
        url={url}
        source={source}
      />,
    );
  }, [
    needsUpdate,
    isSplashLoaded,
    source,
    closeModal,
    showModal,
    version,
    url,
  ]);

  useEffect(() => {
    MigrationService.migrateIfNeeded(preferences, queryClient);
  }, [preferences, queryClient]);

  useEffect(() => {
    if (!needsMigration && isSplashLoaded) return;

    const timeout = setTimeout(async () => {
      if (await AccessibilityInfo.isScreenReaderEnabled()) {
        AccessibilityInfo.announceForAccessibility(t('common.loading'));
      }
    }, LOADING_ANNOUNCEMENT_DELAY);

    return () => clearTimeout(timeout);
  }, [needsMigration, isSplashLoaded, t]);

  if (needsMigration) return null;
  return (
    <>
      <BottomModal
        dismissable
        {...bottomModal}
        onModalHide={() => setVersionModalVisible(false)}
      />
      {isLogged && !preferences.loginUid ? (
        <DownloadsProvider>
          <RootNavigator versionModalIsOpen={versionModalVisible} />
        </DownloadsProvider>
      ) : (
        <GuestNavigator />
      )}
    </>
  );
};
