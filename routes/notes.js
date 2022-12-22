const express = require("express");
const login = require("../middlewear/login");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

router.get("/notes", login, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

router.post(
  "/addnote",
  login,
  [
    body("title").isLength({ min: 5 }),
    body("description", "description atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savenote = await note.save();
      res.json(savenote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.put("/update/:id", login, async (req, res) => {
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  let noted = await Note.findById(req.params.id);
  if (!noted) {
    return res.status(404).send("not found");
  }
  if (noted.user.toString() !== req.user.id) {
    return res.status(401).send("not allowed");
  }
  noted = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(noted);
});

router.delete("/delete/:id", login, async (req, res) => {
  let noted = await Note.findById(req.params.id);
  if (!noted) {
    return res.status(404).send("not found");
  }
  if (noted.user.toString() !== req.user.id) {
    return res.status(401).send("not allowed");
  }
  noted = await Note.findByIdAndDelete(req.params.id);
  res.json({ success: "note as been delete" });
});
module.exports = router;
