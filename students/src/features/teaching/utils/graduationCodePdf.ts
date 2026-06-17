import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

import {
  EncodingType,
  readAsStringAsync,
} from '../../../core/storage/fileSystem';

const graduationCodePdfLogo =
  require('../../../../assets/graduation-code-pdf-logo.png') as number;
const graduationCodePdfTemplate =
  require('../../../../assets/graduation-code-pdf.html') as number;

export type GraduationCodePdfLabels = {
  event: string;
  date: string;
  admissions: string;
  location: string;
  map: string;
  qrTitle: string;
  codeId: string;
};

export type GraduationCodePdfContent = {
  fullName: string;
  eventTitle: string;
  dateTime: string;
  maxAdmissionsText: string;
  location: string;
  mapUrl: string;
  instruction: string;
  admissionCodeId: string;
  qrCodeSvg: string;
  labels: GraduationCodePdfLabels;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderRow = (label: string, value: string, alignTop = false) => `
  <div class="row${alignTop ? ' row-top' : ''}">
    <div class="row-label">${escapeHtml(label)}</div>
    <div class="row-value">${escapeHtml(value)}</div>
  </div>
`;

const renderLocationRow = (
  label: string,
  value: string,
  mapLabel: string,
  mapUrl: string,
) => `
  <div class="row">
    <div class="row-label">${escapeHtml(label)}</div>
    <div class="row-value">${escapeHtml(value)}</div>
    ${
      mapUrl
        ? `<a class="map-button" href="${escapeHtml(mapUrl)}">${escapeHtml(mapLabel)}</a>`
        : ''
    }
  </div>
`;

let templatePromise: Promise<string> | null = null;
let logoDataUriPromise: Promise<string> | null = null;

const loadAssetUri = async (moduleId: number) => {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  if (!asset.localUri) {
    throw new Error('Failed to load asset');
  }
  return asset.localUri;
};

const loadTemplate = () => {
  if (!templatePromise) {
    templatePromise = loadAssetUri(graduationCodePdfTemplate).then(uri =>
      readAsStringAsync(uri, { encoding: EncodingType.UTF8 }),
    );
  }
  return templatePromise;
};

const loadLogoDataUri = () => {
  if (!logoDataUriPromise) {
    logoDataUriPromise = loadAssetUri(graduationCodePdfLogo).then(uri =>
      readAsStringAsync(uri, { encoding: EncodingType.Base64 }).then(
        base64 => `data:image/png;base64,${base64}`,
      ),
    );
  }
  return logoDataUriPromise;
};

const fillTemplate = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  );

export const buildGraduationCodePdfHtml = async ({
  fullName,
  eventTitle,
  dateTime,
  maxAdmissionsText,
  location,
  mapUrl,
  instruction,
  admissionCodeId,
  qrCodeSvg,
  labels,
}: GraduationCodePdfContent) => {
  const [template, logoSrc] = await Promise.all([
    loadTemplate(),
    loadLogoDataUri(),
  ]);

  const detailRows = [
    renderRow(labels.event, eventTitle),
    renderRow(labels.date, dateTime),
    renderRow(labels.admissions, maxAdmissionsText),
    location
      ? renderLocationRow(labels.location, location, labels.map, mapUrl)
      : '',
  ].join('');

  return fillTemplate(template, {
    LOGO_SRC: logoSrc,
    FULL_NAME: escapeHtml(fullName),
    EVENT_TITLE: escapeHtml(eventTitle),
    DETAIL_ROWS: detailRows,
    QR_TITLE: escapeHtml(labels.qrTitle),
    INSTRUCTION: escapeHtml(instruction),
    QR_CODE_SVG: qrCodeSvg,
    CODE_ID_LABEL: escapeHtml(labels.codeId),
    ADMISSION_CODE_ID: escapeHtml(admissionCodeId),
  });
};

const toFileUri = (path: string) =>
  path.startsWith('file://') ? path : `file://${path}`;

const createGraduationCodePdfFileUri = async (
  content: GraduationCodePdfContent,
) => {
  const html = await buildGraduationCodePdfHtml(content);
  const sanitize = (value: string) => value.replace(/[\\/:*?"<>|]/g, '').trim();
  const fileName = `${sanitize(content.fullName).replace(/\s+/g, '-')}_${sanitize(
    content.eventTitle,
  )}`;
  const pdf = await RNHTMLtoPDF.convert({
    html,
    fileName,
    width: 497,
    height: 842,
    padding: 0,
    bgColor: '#FFFFFF',
  });

  if (!pdf.filePath) {
    throw new Error('PDF generation failed');
  }

  return toFileUri(pdf.filePath);
};

export const shareGraduationCodePdf = async (
  content: GraduationCodePdfContent,
  dialogTitle: string,
) => {
  const fileUri = await createGraduationCodePdfFileUri(content);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/pdf',
    dialogTitle,
    UTI: 'com.adobe.pdf',
  });
};
