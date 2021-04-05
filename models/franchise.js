const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const franchiseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
    unique: 1,
  },
  macAddress: {
    type: String,
    required: true,
    unique: 1,
  },
  deviceSerialNumber: {
    type: String,
    required: true,
    unique: 1,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Franchise", franchiseSchema);
