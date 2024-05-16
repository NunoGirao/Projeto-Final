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
    res.render('events/index', { events });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).send('Erro ao buscar eventos');
  }
};

exports.showCreateEventForm = async (req, res) => {
  try {
    const places = await Place.find();
    res.render('events/create', { places });
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    res.status(500).send('Erro ao buscar locais');
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
    res.redirect('/backoffice/events');
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).send('Erro ao criar evento: ' + error);
  }
};

exports.showEditEventForm = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId).populate('place');
    const places = await Place.find();
    res.render('events/edit', { event, places });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).send('Erro ao buscar evento');
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

    await Event.findByIdAndUpdate(eventId, updateData);
    res.redirect('/backoffice/events');
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).send('Erro ao atualizar evento: ' + error);
  }
};

exports.showEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId).populate('place');
    if (!event) {
      return res.status(404).send('Evento não encontrado');
    }
    res.render('events/show', { event });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).send('Erro ao buscar evento');
  }
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    await Event.findByIdAndDelete(eventId);
    res.redirect('/backoffice/events');
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).send('Erro ao deletar evento');
  }
};
