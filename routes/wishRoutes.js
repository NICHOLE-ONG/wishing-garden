const express = require("express");
const router = express.Router();

const {
    getWishes,
    getMyWishes,
    createWish,
    waterWish
} = require("../controllers/wishController");

router.get("/", getWishes);
router.get("/user", getMyWishes);
router.post("/", createWish);
router.post("/:id/water", waterWish);

module.exports = router;