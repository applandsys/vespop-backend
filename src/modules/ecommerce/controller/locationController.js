
const {getPrimaryLocations, insertLocation, updateLocationInDatabase, getAllLocations, getAllLocationsByParentId,
    getAllLocationsByLevel
} = require("../model/locationModel");
const generateSlug = require("../../../utils/slugGenerate");

const allPrimaryLocation =  async (req,res) => {
    const locations = await getPrimaryLocations();
    res.json(locations);
}

const allLocations =  async (req,res) => {
    const locations = await getAllLocations();
    res.json(locations);
}

const allLocationsByLevel =  async (req,res) => {
    const locationLevel = req.params.level;
    const locations = await getAllLocationsByLevel(locationLevel);
    res.json(locations);
}

const allLocationsByParentId =  async (req,res) => {
    const parentId = req.params.parentId;
    const locations = await getAllLocationsByParentId(parentId);
    res.json(locations);
}

const addLocation =  async (req,res) => {
    const {name,parentId,level} = req.body;
    const data = {name, slug: generateSlug(name) ,parentId: parseInt(parentId),level};
    const location = await insertLocation(data);
    res.json(location);
}

const updateLocation = async (req, res) => {
    const { name, parentId } = req.body;
    const { id } = req.params;
    const data = { name, slug: generateSlug(name), parentId };
    const location = await updateLocationInDatabase(id, data);  // Add this update method in your model
    res.json(location);
};

module.exports = {
    allPrimaryLocation,
    allLocations,
    allLocationsByLevel,
    addLocation,
    updateLocation,
    allLocationsByParentId
};
