const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

exports.purchaseTicket = async (req, res) => {
    try {
        const { eventId, quantity } = req.body;
        const userId = req.user._id; // Assumindo que o usuário está autenticado e seu ID está disponível em req.user

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Evento não encontrado');
        }

        const totalPrice = event.price * quantity;
        const ticketNumber = uuidv4();

        // Gerar o QR code
        const qrCodeData = `Ticket Number: ${ticketNumber}, Event: ${event.name}, User: ${userId}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);

        const newTicket = new Ticket({
            event: eventId,
            user: userId,
            quantity,
            totalPrice,
            ticketNumber,
            qrCode
        });

        await newTicket.save();

        res.status(201).send(newTicket);
    } catch (error) {
        console.error('Erro ao comprar bilhete:', error);
        res.status(500).send('Erro ao comprar bilhete');
    }
};

exports.getTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = await Ticket.findById(ticketId).populate('event').populate('user');

        if (!ticket) {
            return res.status(404).send('Bilhete não encontrado');
        }

        res.status(200).send(ticket);
    } catch (error) {
        console.error('Erro ao buscar bilhete:', error);
        res.status(500).send('Erro ao buscar bilhete');
    }
};
