import { File, Paths } from 'expo-file-system';

export const getProfilePictureFile = (username: string) =>
  new File(Paths.cache, `${username}.jpg`);

export const deleteProfilePictureFile = (username: string) => {
  const file = getProfilePictureFile(username);
  if (file.exists) {
    file.delete();
  }
};
