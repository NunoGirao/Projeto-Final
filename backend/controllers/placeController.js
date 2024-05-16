const Place = require('../models/Place');

const placeController = {};

placeController.showAll = async (req, res, next) => {
    try {
        const places = await Place.find();
        res.render('places/index', { places });
    } catch (err) {
        console.error('Erro ao buscar locais:', err);
        res.status(500).send('Erro ao buscar locais');
    }
};

placeController.showCreateForm = (req, res) => {
    res.render('places/create');
};

placeController.create = async (req, res) => {
    try {
        const { name, address, category, latitude, longitude } = req.body;
        const newPlace = new Place({ name, address, category, latitude, longitude });
        await newPlace.save();
        res.redirect('/backoffice/places');
    } catch (err) {
        console.error('Erro ao criar local:', err);
        res.status(500).send('Erro ao criar local');
    }
};

placeController.show = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).send('Local não encontrado');
        }
        res.render('places/show', { place });
    } catch (err) {
        console.error('Erro ao buscar local:', err);
        res.status(500).send('Erro ao buscar local');
    }
};

placeController.showEditForm = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).send('Local não encontrado');
        }
        res.render('places/edit', { place });
    } catch (err) {
        console.error('Erro ao buscar local:', err);
        res.status(500).send('Erro ao buscar local');
    }
};

placeController.edit = async (req, res) => {
    try {
        const { name, address, category, latitude, longitude } = req.body;
        await Place.findByIdAndUpdate(req.params.id, { name, address, category, latitude, longitude });
        res.redirect('/backoffice/places');
    } catch (err) {
        console.error('Erro ao atualizar local:', err);
        res.status(500).send('Erro ao atualizar local');
    }
};

module.exports = placeController;
