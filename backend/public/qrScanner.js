// public/qrScanner.js
import QrScanner from 'qr-scanner';

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', function() {
    window.location.href = '/admin';
  });

  const videoElem = document.getElementById('qr-video');
  const resultData = document.getElementById('result-data');
  const resultContainer = document.getElementById('result');

  function onScanSuccess(decodedText) {
    resultData.innerText = decodedText;
    resultContainer.style.display = 'block';

    fetch('http://localhost:5555/api/tickets/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify({ qrData: decodedText })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error redeeming ticket:', error);
    });
  }

  const qrScanner = new QrScanner(videoElem, result => onScanSuccess(result), {
    onDecodeError: error => console.warn(`QR error = ${error}`)
  });
  qrScanner.start();
});
