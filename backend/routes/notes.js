const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

router.use(auth);

router.post('/', createNote);         // POST /api/notes
router.get('/', getNotes);            // GET /api/notes
router.get('/:id', getNote);          // GET /api/notes/:id
router.put('/:id', updateNote);       // PUT /api/notes/:id
router.delete('/:id', deleteNote);    // DELETE /api/notes/:id

module.exports = router;
