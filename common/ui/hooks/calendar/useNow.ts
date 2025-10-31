import { useEffect, useState } from 'react';

import { APP_TIMEZONE } from '@lib/core/utils/dates';

import { DateTime } from 'luxon';

export function useNow(enabled: boolean) {
  const [now, setNow] = useState(DateTime.now().setZone(APP_TIMEZONE));

  useEffect(() => {
    if (!enabled) {
      return () => {};
    }
    const pid = setInterval(
      () => setNow(DateTime.now().setZone(APP_TIMEZONE)),
      60 * 1000,
    );
    return () => clearInterval(pid);
  }, [enabled]);

  return {
    now,
  };
}
