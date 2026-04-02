import { useEffect, useState } from 'react';

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

export const AppContent = () => {
  const { isLogged } = useApiContext();
  const preferences = usePreferencesContext<AppPreferences>();
  const queryClient = useQueryClient();
  const { isSplashLoaded } = useSplashContext();

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

  if (MigrationService.needsMigration(preferences)) return null;
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
