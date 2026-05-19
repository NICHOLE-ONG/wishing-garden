const Wish = require("../models/Wish");

exports.renderGarden = async (req, res) => {
    try{
    const wishes = await Wish.find();
    res.render("garden", { wishes });
    }
    catch(err){
        console.error('Error reading database')
    }
};