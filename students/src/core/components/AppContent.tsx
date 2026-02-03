import { useEffect, useState } from 'react';

import { usePreferencesContext } from '@polito/lib';
import { useSplashContext } from '@polito/lib';
import { useBottomModal } from '@polito/lib';
import { BottomModal } from '@polito/lib';
import { useQueryClient } from '@tanstack/react-query';

import { useApiContext } from '../contexts/ApiContext';
import { useCheckForUpdate } from '../hooks/useCheckForUpdate';
import { MigrationService } from '../migrations/MigrationService';
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
        <RootNavigator versionModalIsOpen={versionModalVisible} />
      ) : (
        <GuestNavigator />
      )}
    </>
  );
};
