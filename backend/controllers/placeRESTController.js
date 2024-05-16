const Place = require('../models/Place');

const placeRESTController = {};

placeRESTController.showAll = async (req, res, next) => {
    try {
        const places = await Place.find();
        res.render('places/index', { places });
    } catch (err) {
        console.error('Erro ao buscar locais:', err);
        res.status(500).send('Erro ao buscar locais');
    }
};

placeRESTController.show = async (req, res, next) => {
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

placeRESTController.edit = async (req, res, next) => {
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

placeRESTController.update = async (req, res, next) => {
    try {
        const placeId = req.params.id;
        const updateData = {
            name: req.body.name,
            address: req.body.address,
            category: req.body.category,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };

        await Place.findByIdAndUpdate(placeId, updateData);
        res.redirect('/backoffice/places');
    } catch (err) {
        console.error('Erro ao atualizar local:', err);
        res.status(500).send('Erro ao atualizar local');
    }
};

placeRESTController.delete = async (req, res, next) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.redirect('/backoffice/places');
    } catch (err) {
        console.error('Erro ao deletar local:', err);
        res.status(500).send('Erro ao deletar local');
    }
};

placeRESTController.create = async (req, res, next) => {
    try {
        const newPlace = new Place({
            name: req.body.name,
            address: req.body.address,
            category: req.body.category,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        await newPlace.save();
        res.redirect('/backoffice/places');
    } catch (err) {
        console.error('Erro ao criar local:', err);
        res.status(500).send('Erro ao criar local');
    }
};

module.exports = placeRESTController;
