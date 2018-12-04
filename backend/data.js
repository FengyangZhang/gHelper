const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const songChordSchema = new Schema(
  {
    songName: String,
    singerName: String,
    mode: String,
    chords: String,
    genre: String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("songChord", songChordSchema);