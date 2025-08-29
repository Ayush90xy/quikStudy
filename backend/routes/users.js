const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

router.post('/register', register); // POST /api/users/register
router.post('/login', login);       // POST /api/users/login

module.exports = router;
