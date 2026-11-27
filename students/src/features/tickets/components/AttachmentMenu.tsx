import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { openCamera, openPicker } from 'react-native-image-crop-picker';

import { useFeedbackContext } from '@polito/lib/core';
import { pdfSizes } from '@polito/lib/features/courses';
import { pick, types } from '@react-native-documents/picker';
import { MenuView } from '@react-native-menu/menu';

import { Attachment } from '../../services/types/Attachment';

interface Props {
  children: ReactElement;
  disabled?: boolean;
  onAttachmentChange: (attachment: Attachment) => void;
}

const fileTypes = [
  types.pdf,
  types.images,
  types.video,
  types.zip,
  types.doc,
  types.docx,
  types.xlsx,
  types.xls,
];

export const AttachmentMenu = ({
  children,
  disabled = false,
  onAttachmentChange,
}: Props) => {
  const { t } = useTranslation();
  const { setFeedback } = useFeedbackContext();

  const pickFile = async () => {
    try {
      const result = await pick({
        type: fileTypes,
        allowMultiSelection: false,
      });

      const res = result[0];
      if (!res.name || !res.size || !res.type) return;
      if (res.size > 32 * 1000000) {
        setFeedback({
          text: t('common.sizeExc'),
          isError: true,
          isPersistent: false,
        });
        return;
      }
      onAttachmentChange({
        uri: res.uri,
        name: res.name,
        size: res.size,
        type: res.type,
      });
    } catch (error) {
      console.error('Cannot pick file', error);
    }
  };

  const getPhotoName = (filename: string | null | undefined, mime: string) => {
    if (filename) {
      return filename;
    }
    const extension = mime.split('/')[1] || 'jpg';
    return `${Date.now()}.${extension}`;
  };

  const pickPhoto = async () => {
    try {
      const picture = await openPicker({
        mediaType: 'photo',
        multiple: false,
      });
      onAttachmentChange({
        uri: picture.path,
        name: getPhotoName(picture.filename, picture.mime),
        size: picture.size,
        type: picture.mime,
      });
    } catch (error) {
      console.error('Cannot pick photo', error);
    }
  };

  const takePhoto = async () => {
    try {
      const picture = await openCamera({
        ...pdfSizes,
        mediaType: 'photo',
        multiple: false,
        cropping: true,
        freeStyleCropEnabled: true,
        includeBase64: true,
      });
      onAttachmentChange({
        uri: picture.path,
        name: getPhotoName(picture.filename, picture.mime),
        size: picture.size,
        type: picture.mime,
      });
    } catch (error) {
      console.error('Cannot take photo', error);
    }
  };

  if (disabled) {
    return children;
  }

  return (
    <MenuView
      title={t('ticketScreen.pickFileTitle')}
      actions={[
        {
          id: 'pickFile',
          title: t('messagingView.pickFile'),
          subtitle: t('messagingView.pickFileHint'),
          image: 'folder',
        },
        {
          id: 'pickPhoto',
          title: t('messagingView.pickPhoto'),
          subtitle: t('messagingView.pickPhotoHint'),
          image: 'photo',
        },
        {
          id: 'takePhoto',
          title: t('messagingView.takePhoto'),
          subtitle: t('messagingView.takePhotoHint'),
          image: 'camera',
        },
      ]}
      onPressAction={event => {
        switch (event.nativeEvent.event) {
          case 'pickFile':
            pickFile();
            break;
          case 'pickPhoto':
            pickPhoto();
            break;
          case 'takePhoto':
            takePhoto();
            break;
          default:
            break;
        }
      }}
    >
      {children}
    </MenuView>
  );
};
