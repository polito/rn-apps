import { __seedCredentials } from '@polito/lib/testing/mocks/keychain';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '~/App';

const openServicesTab = async () => {
  await render(<App />);

  await fireEvent.press(await screen.findByText('Services'));

  return screen.findByText('Book Places');
};

describe('Services flow: Services tab and the booking service', () => {
  beforeEach(() => {
    __seedCredentials({ username: 'd123456', password: 'fake-password' });
  });

  it('pressing the Services tab shows the service cards', async () => {
    expect(await openServicesTab()).toBeOnTheScreen();

    // Mail and Contacts are the two services marked as favourites
    expect(screen.getByText('Mail')).toBeOnTheScreen();
    expect(screen.getByText('Contacts')).toBeOnTheScreen();
  });

  it('pressing Book Places opens the booking options', async () => {
    await openServicesTab();

    await fireEvent.press(screen.getByText('Book Places'));

    expect(await screen.findByText('Request room')).toBeOnTheScreen();
    expect(screen.getByText('Request events places')).toBeOnTheScreen();
  });
});
