const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const QRCode = require('qrcode');

exports.showAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('event');
    res.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    res.status(500).send('Erro ao buscar tickets');
  }
};

exports.showTicket = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await Ticket.findById(ticketId).populate('event');
    if (!ticket) {
      return res.status(404).send('Ticket não encontrado');
    }
    res.json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    res.status(500).send('Erro ao buscar ticket');
  }
};

exports.purchaseTicket = async (req, res) => {
  try {
    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).send('Evento não encontrado');
    }

    const ticketCode = await QRCode.toDataURL(`Ticket for ${event.name}`);
    const newTicket = new Ticket({
      event: req.body.eventId,
      user: req.user._id,
      code: ticketCode
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Erro ao comprar bilhete:', error);
    res.status(500).send('Erro ao comprar bilhete');
  }
};

exports.cancelTicket = async (req, res) => {
  const ticketId = req.params.id;
  try {
    await Ticket.findByIdAndDelete(ticketId);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao cancelar ticket:', error);
    res.status(500).send('Erro ao cancelar ticket');
  }
};
