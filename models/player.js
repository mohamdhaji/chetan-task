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
  },
 
  playerStatus: {
    type: Object,
  },
});

module.exports = mongoose.model("Player", playerSchema);
