import RNHTMLtoPDF from 'react-native-html-to-pdf';

import * as Sharing from 'expo-sharing';

import { POLITO_PDF_LOGO_HTML } from './graduationCodePdfLogo';

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
}: GraduationCodePdfContent) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');

      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-family: Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #262626;
        background: #ffffff;
      }

      .page {
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      .header {
        background: #002b49;
        padding: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .logo {
        width: 272px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .header-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
      }

      .header-context {
        color: #ffffff;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
      }

      .header-name {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
      }

      .body {
        flex: 1;
        padding: 12px 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .details {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 3px 0;
      }

      .row-top {
        align-items: flex-start;
      }

      .row-label {
        color: #262626;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
      }

      .row-value {
        flex: 1;
        color: #262626;
        font-size: 14px;
        font-weight: 400;
        word-break: break-word;
      }

      .map-button {
        flex-shrink: 0;
        align-self: center;
        background: #006db4;
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        padding: 6px 12px;
        border-radius: 6px;
      }

      .qr-card {
        width: 100%;
        background: #f1f5f9;
        border-radius: 16px;
        padding: 24px 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .qr-title {
        width: 100%;
        text-align: center;
        color: #262626;
        font-size: 20px;
        font-weight: 600;
      }

      .qr-instruction {
        width: 100%;
        text-align: center;
        color: #b94b04;
        font-size: 10px;
        font-weight: 500;
        line-height: 1.25;
      }

      .qr-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 9px;
        padding: 0 24px;
      }

      .qr-image {
        width: 207px;
        height: 207px;
      }

      .qr-image svg {
        width: 100%;
        height: 100%;
      }

      .code-id-label {
        width: 100%;
        text-align: center;
        color: #262626;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.25;
      }

      .code-id-value {
        width: 100%;
        text-align: center;
        color: #262626;
        font-size: 10px;
        font-weight: 500;
        line-height: 1.25;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="logo">${POLITO_PDF_LOGO_HTML}</div>
        <div class="header-text">
          <div class="header-context">${escapeHtml(eventTitle)}</div>
          <div class="header-name">${escapeHtml(fullName)}</div>
        </div>
      </div>
      <div class="body">
        <div class="details">
          ${renderRow(labels.event, eventTitle)}
          ${renderRow(labels.date, dateTime)}
          ${renderRow(labels.admissions, maxAdmissionsText)}
          ${location ? renderLocationRow(labels.location, location, labels.map, mapUrl) : ''}
        </div>
        <div class="qr-card">
          <div class="qr-title">${escapeHtml(labels.qrTitle)}</div>
          <div class="qr-instruction">${escapeHtml(instruction)}</div>
          <div class="qr-block">
            <div class="qr-image">${qrCodeSvg}</div>
            <div class="code-id-label">${escapeHtml(labels.codeId)}</div>
            <div class="code-id-value">${escapeHtml(admissionCodeId)}</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

const toFileUri = (path: string) =>
  path.startsWith('file://') ? path : `file://${path}`;

const createGraduationCodePdfFileUri = async (
  content: GraduationCodePdfContent,
) => {
  const html = buildGraduationCodePdfHtml(content);
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
