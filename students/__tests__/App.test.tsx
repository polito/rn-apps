import { render, screen } from '@testing-library/react-native';

import App from '../src/App';

describe('app boot (smoke)', () => {
  test('boots to the SSO screen as a guest', async () => {
    await render(<App />);

    expect(
      await screen.findByText('Sign in with Single-Sign-On'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('or sign in with your credentials'),
    ).toBeOnTheScreen();
  });
});
