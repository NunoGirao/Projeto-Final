const admin = require('firebase-admin');
const path = require('path');

// Carregar o arquivo de chave JSON
const serviceAccount = require(path.join(__dirname, 'firebase-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'pditrabalho.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = bucket;
