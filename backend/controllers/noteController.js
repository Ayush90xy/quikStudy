const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const note = await Note.create({ user: req.user.id, title, content });
    res.status(201).json(note);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Invalid note id' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { title, content } },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Invalid note id' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Invalid note id' });
  }
};
