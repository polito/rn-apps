import { generatePDF } from 'react-native-html-to-pdf';

import * as Sharing from 'expo-sharing';

import { GRADUATION_CODE_PDF_LOGO } from './graduationCodePdfLogo';
import { GRADUATION_CODE_PDF_TEMPLATE } from './graduationCodePdfTemplate';

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

const renderMapSection = (label: string, mapUrl: string) =>
  mapUrl
    ? `
  <div class="map-section">
    <div class="map-section-label">${escapeHtml(label)}</div>
    <a class="map-link" href="${escapeHtml(mapUrl)}">${escapeHtml(mapUrl)}</a>
  </div>
`
    : '';

const fillTemplate = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  );

export const buildGraduationCodePdfHtml = ({
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
  const detailRows = [
    renderRow(labels.event, eventTitle),
    renderRow(labels.date, dateTime),
    renderRow(labels.admissions, maxAdmissionsText),
    location ? renderRow(labels.location, location) : '',
  ].join('');

  return fillTemplate(GRADUATION_CODE_PDF_TEMPLATE, {
    LOGO_SRC: GRADUATION_CODE_PDF_LOGO,
    FULL_NAME: escapeHtml(fullName),
    EVENT_TITLE: escapeHtml(eventTitle),
    DETAIL_ROWS: detailRows,
    MAP_SECTION: renderMapSection(labels.map, mapUrl),
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
  const html = buildGraduationCodePdfHtml(content);
  const sanitize = (value: string) =>
    value
      .trim()
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, '-');
  const fileName = `${sanitize(content.fullName)}_${sanitize(
    content.eventTitle,
  )}`;
  const pdf = await generatePDF({
    html,
    fileName,
    width: 497,
    height: 842,
    padding: 0,
    bgColor: '#FFFFFF',
    shouldPrintBackgrounds: true,
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
