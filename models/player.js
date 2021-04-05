const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  contactNumber: {
    type: Number,
    required: true,
    unique: 1,
  },
  playerStatus: {
    level: {
      type: Number,
      default: 1,
    },
    MatchesPlayed: {
      type: Number,
      default: 0,
    },
    overPlayed: {
      type: Boolean,
    },
    runsChase: {
      type: Boolean,
    },
    Difficulty: {
      type: String,
    },
    Score: {
      type: Number,
    },
    strikeRate: {
      type: Number,
    },
    runRate: {
      type: Number,
    },
  },
  Active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Player", playerSchema);
