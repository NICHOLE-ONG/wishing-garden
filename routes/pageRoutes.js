const express = require("express");
const router = express.Router();

const { renderGarden } = require("../controllers/pageController");

router.get("/", renderGarden);

module.exports = router;