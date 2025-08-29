// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const { handleAI } = require('../controllers/aiController');

// router.use(auth);
// router.post('/:feature', handleAI); // POST /api/ai/:feature

// module.exports = router;

const express = require("express");
const { handleAI } = require("../controllers/aiController");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);
router.post("/:feature", handleAI);

module.exports = router;
