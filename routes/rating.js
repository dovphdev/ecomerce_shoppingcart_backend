const express = require("express");
const router = express.Router();

const { auth, adminCheck } = require("../middleware/auth");

const {index, show, create, update, remove } = require('../controllers/rating')


router.get("/rating", auth, index);
router.get("/rating/:id",auth,  show);
router.post("/rating", auth, create);
router.put("/rating/:id", auth, update);
router.delete("/rating/:id", auth, remove);

module.exports = router;
