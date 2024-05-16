const Event = require('../models/Event');
const Place = require('../models/Place');
const path = require('path');
const bucket = require('../config/firebase');

async function uploadImageToFirebase(file) {
  const blob = bucket.file(Date.now() + path.extname(file.originalname));
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      reject('Erro ao fazer upload para o Firebase: ' + error);
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      } catch (error) {
        reject('Erro ao tornar o arquivo público: ' + error);
      }
    });

    blobStream.end(file.buffer);
  });
}

exports.showAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('place');
    res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const imageUrl = req.file ? await uploadImageToFirebase(req.file) : null;
    const newEvent = new Event({
      name: req.body.name,
      type: req.body.type,
      subtype: req.body.subtype,
      date: req.body.date,
      price: req.body.price,
      occupation: req.body.occupation,
      capacity: req.body.capacity,
      place: req.body.place,
      image: imageUrl
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
};

exports.editEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const updateData = {
      name: req.body.name,
      type: req.body.type,
      subtype: req.body.subtype,
      date: req.body.date,
      price: req.body.price,
      occupation: req.body.occupation,
      capacity: req.body.capacity,
      place: req.body.place
    };

    if (req.file) {
      updateData.image = await uploadImageToFirebase(req.file);
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
};

exports.showEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId).populate('place');
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
};
