import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import NavBar from './navbar';

const QrCodeScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:5555/api/tickets/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({ qrData: data }),
        });

        if (!response.ok) {
          throw new Error('Failed to redeem ticket');
        }

        const result = await response.json();
        alert(`Ticket successfully redeemed! NFT Image: ${result.nftImage}`);
      } catch (error) {
        setError(error.message);
        console.error("Error redeeming ticket:", error);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error scanning QR code');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Scan QR Code</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="flex justify-center">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '300px' }}
          />
        </div>
        {scanResult && <p className="text-center mt-4">QR Code Result: {scanResult}</p>}
      </div>
    </div>
  );
};

export default QrCodeScanner;
