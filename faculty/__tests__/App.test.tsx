import { render, screen } from '@testing-library/react-native';

import App from '../src/App';

describe('app boot (smoke)', () => {
  test('boots into the Didattica (Teaching) tab', async () => {
    await render(<App />);

    // The Didattica tab label and the Teaching landing screen both render
    // the "Teaching" string, so at least one must be on screen once booted.
    expect((await screen.findAllByText('Teaching')).length).toBeGreaterThan(0);
  });
});
