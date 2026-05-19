const Wish = require("../models/Wish");
const generatePosition = require("../utils/position");

exports.getWishes = async (req, res) => {
    try{
    const wishes = await Wish.find().sort({ createdAt: -1 });
    res.json(wishes);
    }
    catch(err){
        console.error('Error reading database')
    }
};

exports.getMyWishes = async (req, res) => {
    try{
    const { name } = req.query;
    const wishes = await Wish.find({ createdBy: name })
        .sort({ createdAt: -1 });

    res.json(wishes);
    }
    catch(err){
        console.error('Error reading database')
    }
};

exports.createWish = async (req, res) => {
    try {
        const { message, strokes, createdBy } = req.body;

        const wish = await Wish.create({
            message,
            strokes,
            createdBy: createdBy || "Anonymous",
            position: generatePosition()
        });

        return res.status(201).json(wish);

    } catch (err) {
        console.error('Error creating wish:', err);
        return res.status(500).json({ error: err.message });
    }
};

//increment water count for each wish
exports.waterWish = async (req, res) => {
    try{
    const wish = await Wish.findById(req.params.id);
    
    wish.waterCount += 1;
    await wish.save();

    res.json(wish);
    }
    catch(err){
        console.error('Error watering plant')
    }
};