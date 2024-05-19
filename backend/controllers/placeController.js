const Place = require('../models/Place');

let placeController = {};

placeController.createPlace = async function (req, res) {
  try {
    const { name, address, category, latitude, longitude } = req.body;

    const newPlace = new Place({
      name,
      address,
      category,
      latitude,
      longitude
    });

    await newPlace.save();
    res.status(201).send(newPlace);
  } catch (err) {
    res.status(500).send("Error creating place: " + err.message);
  }
};

placeController.getAllPlaces = async function (req, res) {
  try {
    const places = await Place.find();
    res.status(200).send(places);
  } catch (err) {
    res.status(500).send("Error retrieving places: " + err.message);
  }
};

placeController.getPlaceById = async function (req, res) {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).send("Place not found");
    res.status(200).send(place);
  } catch (err) {
    res.status(500).send("Error retrieving place: " + err.message);
  }
};

placeController.updatePlace = async function (req, res) {
  try {
    const { name, address, category, latitude, longitude } = req.body;

    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, {
      name,
      address,
      category,
      latitude,
      longitude,
      updated_at: Date.now()
    }, { new: true });

    if (!updatedPlace) return res.status(404).send("Place not found");
    res.status(200).send(updatedPlace);
  } catch (err) {
    res.status(500).send("Error updating place: " + err.message);
  }
};

placeController.deletePlace = async function (req, res) {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).send("Place not found");
    res.status(200).send({ message: "Place deleted successfully" });
  } catch (err) {
    res.status(500).send("Error deleting place: " + err.message);
  }
};



module.exports = placeController;
