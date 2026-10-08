import { __seedCredentials } from '@polito/lib/testing/mocks/keychain';
import { render, screen } from '@testing-library/react-native';

import App from '../src/App';

describe('app boot (smoke)', () => {
  beforeEach(() => {
    __seedCredentials({ username: 'd123456', password: 'fake-password' });
  });

  test('boots into the Didattica (Teaching) tab', async () => {
    await render(<App />);

    expect((await screen.findAllByText('Teaching')).length).toBeGreaterThan(0);
  });
});
