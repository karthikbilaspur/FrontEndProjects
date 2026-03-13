import React, { useState } from 'react';
import styles from './QRCodeGenerator.module.css';
import { generateQRCode } from './qrCodeUtils';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQRCode = async () => {
    if (!text) {
      setError('Please enter text or URL');
      return;
    }
    setIsLoading(true);
    try {
      const qrCodeData = await generateQRCode(text);
      setQrCode(qrCodeData);
      setError(null);
    } catch (err) {
      setError('Error generating QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qr-code.png';
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  return (
    <div className={styles.qrCodeGenerator}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.inputField}
        placeholder="Enter text or URL"
      />
      <button className={styles.button} onClick={handleGenerateQRCode} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate QR Code'}
      </button>
      {qrCode && (
        <div className={styles.qrCodeContainer}>
          <img src={qrCode} alt="QR Code" />
          <button className={styles.button} onClick={downloadQRCode}>
            Download QR Code
          </button>
          <button className={styles.button} onClick={copyToClipboard}>
            Copy Text to Clipboard
          </button>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default QRCodeGenerator;