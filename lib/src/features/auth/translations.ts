export const mfaScreenTranslations = {
  en: {
    headerTitle: 'Authenticator',
    biometricPrompt: 'Unlock to use PoliTO Authenticator',
    modalTitle: 'PoliTO Authenticator',
    warning: 'Warning',
    serial: 'Serial',
    enroll: {
      title: 'MFA Activation',
      prompt:
        'Do you want to activate <b>PoliTO Authenticator</b> on this device?',
      note: "By activating PoliTO Authenticator, you will be able to access the <b>University's digital services</b> in a simpler and more secure way.<br/>You will no longer have to wait for SMS or use external apps to confirm your identity.<br/><br/>You can deactivate PoliTO Authenticator at any time by logging out of the app or by accessing <b>idp.polito.it > MFA Management</b>.",
      confirm: 'Yes, proceed',
      unsupported:
        'Warning. No secure lock screen is set on your device. Please set a secure lock screen to use PoliTO Authenticator (PIN, password or biometric authentication).',
      saveFailure:
        'Warning. The authentication key could not be saved on your device. Please visit idp.polito.it > MFA Management to remove the newly created authentication factor.',
      cancel: 'Not now',
      expired: 'The session has expired, please log in again to continue',
      Success:
        'Polito Authenticator has been successfully activated on this device',
      devicePrompt:
        'The name below will be used to <b>identify this device</b> among your authentication factors. <b>You can change it</b> if you want to make it more recognizable.',
      deviceName: 'Device name',
    },
    auth: {
      prompt:
        'New login request with multi-factor authentication. Do you want to proceed?',
      unlockDismissed:
        'Operation cancelled: to authorize or deny access you must first unlock PoliTO Authenticator. Go to the Profile screen and do a pull-down to try again.',
      note: "You didn't request this access? This could be a suspicious attempt. Change your password immediately at <b>idp.polito.it</b>.",
      allow: 'Yes, authorize',
      denyAccess: 'Deny access',
      expiration: 'Time remaining to authorize: {{time}}',
      expired: 'Authentication request expired',
      rejected: 'Authentication request rejected',
      accepted: 'Authentication request accepted',
      failed: 'An error occurred while processing the authentication signature',
    },
    settings: {
      information: 'Information',
      details: 'Details',
      none: 'None',
      disabled: 'Disabled',
      active: 'Active',
      enableNow: 'Enable now',
      correctError: 'Correct error',
      status: 'Status',
      notSet: 'Not set',
      textError: 'Text error',
      description:
        "<b>PoliTO Authenticator</b> is a two-factor authentication method that allows secure and fast access to the University's services by sending a notification to your device for confirmation.<br/><br/>It is based on asymmetric cryptography and is <b>installed per device</b>: each installation is independent and linked to a single device.<br/><br/>The following actions will remove this PoliTO Authenticator installation from your device:<br/>- Logging out <br/>- Uninstalling the app <br/>- Clearing the app data through the device settings<br/><br/>You can manage PoliTO Authenticator at any time by logging out of the app or by accessing <b>idp.polito.it > MFA Management</b>.",
      notAccessible:
        'The cryptographic key for <b>PoliTo Authenticator</b> is not accessible on this device.<br/>This may occur due to activation errors or changes in device credentials (PIN/password/biometric).',
      notAccessibleAlert:
        'The cryptographic key for PoliTo Authenticator is not accessible on this device. Please check the settings page for more information and fix the issue.',
      lockedDescription:
        'PoliTO Authenticator on this device has been blocked for security reasons. Contact technical support as soon as possible using the references available at idp.polito.it/help',
      locked: 'Blocked',
      removed:
        'PoliTO Authenticator on this device has been removed from the MFA Management panel. You can re-add it by entering the dedicated section available on this screen.',
      removedTitle: 'Authenticator Removed',
    },
  },
  it: {
    description:
      "<b>PoliTO Authenticator</b> è un metodo per l'autenticazione multifattore che consente un accesso sicuro e rapido ai servizi dell’Ateneo inviando una notifica al tuo dispositivo per confermare la tua identità.<br/><br/>Si basa sulla crittografia asimmetrica ed è <b>installato per-dispositivo</b>: ogni installazione è indipendente e legata a un singolo dispositivo.<br/><br/>Le seguenti azioni rimuoveranno questa installazione di PoliTO Authenticator dal tuo dispositivo:<br/>- Effettuare il logout <br/>- Disinstallare l’app <br/>- Cancellare i dati dell’app tramite le impostazioni del dispositivo<br/><br/>Puoi sempre gestire tutti i metodi di autenticazione multi-fattore visitando <b>idp.polito.it > Gestione MFA</b>",
    modalTitle: 'PoliTO Authenticator',
    headerTitle: 'Authenticator',
    biometricPrompt: 'Sblocca PoliTO Authenticator per continuare',
    warning: 'Attenzione',
    serial: 'Seriale',
    enroll: {
      title: 'Attivazione Mfa',
      note: "Attivando PoliTO Authenticator potrai accedere in modo più semplice e sicuro <b>ai servizi digitali dell'Ateneo</b>. Non dovrai più attendere SMS o utilizzare app esterne per confermare la tua identità.<br/><br/>Potrai disattivare PoliTO Authenticator in qualsiasi momento, effettuando il logout dall'app oppure accedendo a <b>idp.polito.it > Gestione MFA</b>.",
      prompt: 'Vuoi attivare PoliTO Authenticator su questo dispositivo?',
      confirm: 'Si, attiva',
      unsupported:
        'Attenzione. Su questo dispositivo non è impostata una schermata di blocco sicura. Per poter utilizzare PoliTO Authenticator è necessario impostare una schermata di blocco sicura (PIN, password o riconoscimento biometrico).',
      saveFailure:
        'Attenzione. Non è stato possibile salvare la chiave di autenticazione su questo dispositivo. È necassario rimuovere il metodo appena aggiunto visitando idp.polito.it > Gestione MFA e riprovare.',
      cancel: 'Non ora',
      expired: 'Sessione scaduta. È necessario riautenticarsi.',
      Success:
        'PoliTO Authenticator è stato attivato correttamente su questo dispositivo.',
      devicePrompt:
        'Il nome sottostante verrà utilizzato per <b>identificare questo dispositivo</b> tra i tuoi fattori di autenticazione. <b>Puoi cambiarlo</b> se vuoi renderlo più riconoscibile.',
      deviceName: 'Nome dispositivo',
    },
    auth: {
      prompt:
        'Nuova richiesta di accesso con autenticazione multi-fattore. Vuoi proseguire?',
      unlockDismissed:
        "Operazione annullata: per autorizzare o negare l'accesso è necessario prima sbloccare PoliTO Authenticator. Fai pull-down sulla pagina del profilo personale per riprovare.",
      note: 'Non hai richiesto questo accesso? Potrebbe trattarsi di un tentativo sospetto. Cambia subito la password da <b>idp.polito.it</b>.',
      allow: 'Si, autorizza',
      denyAccess: 'Nega accesso',
      expiration: 'Tempo rimanente per autorizzare: {{time}}',
      expired: 'Richiesta di accesso scaduta',
      rejected: 'Richiesta di accesso respinta',
      accepted: 'Richiesta di accesso accettata',
      failed: "Si è verificato un errore durante l'elaborazione della firma",
    },
    settings: {
      information: 'Informazioni',
      details: 'Dettagli',
      textError: 'Testo errore',
      status: 'Stato',
      notSet: 'Non impostato',
      disabled: 'Disabilitato',
      active: 'Attivo',
      correctError: 'Correggi errore',
      enableNow: 'Attiva ora',
      none: 'Nessuno',
      description:
        "<b>PoliTO Authenticator</b> è un metodo di autenticazione a due fattori che consente un accesso sicuro e rapido ai servizi del Politecnico inviando una notifica al tuo dispositivo per conferma.<br/><br/>Si basa sulla crittografia asimmetrica ed è <b>installato per dispositivo</b>: ogni installazione è indipendente e legata a un singolo dispositivo.<br/><br/>Le seguenti azioni disabiliteranno questa installazione di PoliTO Authenticator per questo dispositivo:<br/>- Disconnessione<br/>- Disinstallazione dell'app<br/>- Cancellazione dei dati dell'app tramite le impostazioni del dispositivo<br/><br/>Puoi sempre gestire tutti i metodi di autenticazione multi-fattore visitando<br/><b>idp.polito.it > Gestione MFA</b>",
      notAccessible:
        "La chiave crittografica per <b>PoliTO Authenticator</b> non è accessibile su questo dispositivo. Questo può accadere se si sono verificati errori durante l'attivazione o se le credenziali del dispositivo (PIN/password/riconoscimento biometrico) sono state modificate.",
      notAccessibleAlert:
        'La chiave crittografica per PoliTO Authenticator non è accessibile su questo dispositivo. Fare riferimento alle impostazioni per ulteriori dettagli e correggere il problema.',
      lockedDescription:
        'PoliTO Authenticator su questo dispositivo è stato bloccato per ragioni di sicurezza. Contattare al più presto il supporto tecnico mediante i riferimenti presenti su idp.polito.it/help',
      locked: 'Bloccato',
      removed:
        'PoliTO Authenticator su questo dispositivo è stato rimosso dal pannello di Gestione MFA. È possibile reimpostarlo entrando nella sezione dedicata presente su questa schermata.',
      removedTitle: 'Authenticator Rimosso',
    },
  },
} as const;
