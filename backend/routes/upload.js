const express = require('express');
const multer = require('multer');
const path = require('path');
const bucket = require('../config/firebase');
const eventRESTController = require('../controllers/eventRESTController');

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/events', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }

    const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    blobStream.on('error', err => {
      res.status(500).send('Erro ao fazer upload da imagem');
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
      req.body.image = publicUrl;
      await eventRESTController.addEventWithImage(req, res);
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).send('Erro ao processar upload');
  }
});

module.exports = router;
