// qrCodeUtils.js
import QRCode from 'qrcode';

export const generateQRCode = async (text) => {
  try {
    const qrCodeData = await QRCode.toDataURL(text);
    return qrCodeData;
  } catch (err) {
    throw new Error('Error generating QR code');
  }
};