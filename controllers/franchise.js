const { validationResult } = require("express-validator");
const Franchise = require("../models/franchise");
var request = require("request");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const macAddress = req.body.macAddress;
  const deviceSerialNumber = req.body.deviceSerialNumber;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;

  const franchise = new Franchise({
    name: name,
    email: email,
    macAddress: macAddress,
    deviceSerialNumber: deviceSerialNumber,
    location: location,
    contactNumber: contactNumber,
  });
  return franchise
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Franchise created!", franchise: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const contactNumber = req.body.contactNumber;
  Franchise.findOne({ email: email, contactNumber: contactNumber })
    .then((franchise) => {
      if (!franchise) {
        const error = new Error("email or contact number is not correct");
        error.statusCode = 401;
        throw error;
      }
      var options = {
        method: "GET",
        url: process.env.OTPSMS_URL,
        headers: {
          Cookie: process.env.OTPSMS_COOKIE,
        },
      };
      request(options, async function (error, response) {
        if (error) throw new Error(error);
        franchise.otp = response.body.slice(0, 4);
        await franchise.save();
        res.status(200).json({ otp: response.body.slice(0, 4),franchise:franchise });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createProfile = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const macAddress = req.body.macAddress;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;
  const deviceSerialNumber = req.body.deviceSerialNumber;

  const franchise = new Franchise({
    name: name,
    email: email,
    macAddress: macAddress,
    location: location,
    contactNumber: contactNumber,
    deviceSerialNumber: deviceSerialNumber,
  });
  return franchise
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Franchise created!", franchiseId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProfile = (req, res, next) => {
  const franchiseId = req.params.franchiseId;

  const name = req.body.name;
  const email = req.body.email;
  const macAddress = req.body.macAddress;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;
  const deviceSerialNumber = req.body.deviceSerialNumber;

  Franchise.findById(franchiseId)
    .then((franchise) => {
      if (!franchise) {
        const error = new Error("Could not find franchise.");
        error.statusCode = 404;
        throw error;
      }

      franchise.name = name || franchise.name;
      franchise.email = email || franchise.email;
      franchise.deviceSerialNumber =
        deviceSerialNumber || franchise.deviceSerialNumber;
      franchise.location = location || franchise.location;
      franchise.contactNumber = contactNumber || franchise.contactNumber;
      franchise.macAddress = macAddress || franchise.macAddress;

      return franchise.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "franchise profile updated!", franchise: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProfiles = (req, res, next) => {
  Franchise.find({}, (err, franchises) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(franchises);
  });
};
