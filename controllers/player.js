const { validationResult } = require("express-validator");
const Player = require("../models/player");

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
  const dateOfBirth = req.body.dateOfBirth;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;

  const player = new Player({
    name: name,
    email: email,
    dateOfBirth: dateOfBirth,
    location: location,
    contactNumber: contactNumber,
  });
  return player
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Player created!", playerId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const name = req.body.name;
  const contactNumber = req.body.contactNumber;
  Player.findOne({ name: name,contactNumber:contactNumber })
    .then((player) => {
      if (!player) {
        const error = new Error("name or contact number is not correct");
        error.statusCode = 401;
        throw error;
      }
      var options = {
        method: "GET",
        url:
          "http://otpsms.vision360solutions.in/api/sendhttp.php?authkey=351966AFCfBrCfr3SG60028af2P1&mobiles=8003621369&message=your otp is 1234&sender=Vision&route=4&country=91",
        headers: {
          Cookie:
            "__cfduid=dd52708ff7620ed9102f78698d84004d91615891425; PHPSESSID=suoravokkkcaqm3hv476bt00f0",
        },
      };
      request(options, async function (error, response) {
        if (error) throw new Error(error);
        player.otp = response.body.slice(0, 4);
        await player.save();
        res.status(200).json({ otp: response.body.slice(0, 4)});
      })
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
  const dateOfBirth = req.body.dateOfBirth;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;
  const playerStatus = req.body.playerStatus;
  const player = new Player({
    name: name,
    email: email,
    dateOfBirth: dateOfBirth,
    location: location,
    contactNumber: contactNumber,
    playerStatus: playerStatus,
  });
  return player
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Player created!", playerId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProfile = (req, res, next) => {
  const playerId = req.params.playerId;

  const name = req.body.name;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;
  const playerStatus = req.body.playerStatus;

  Player.findById(playerId)
    .then((player) => {
      if (!player) {
        const error = new Error("Could not find player.");
        error.statusCode = 404;
        throw error;
      }

      player.name = name || player.name;
      player.email = email || player.email;
      player.dateOfBirth = dateOfBirth || player.dateOfBirth;
      player.location = location || player.location;
      player.contactNumber = contactNumber || player.contactNumber;
      player.playerStatus = playerStatus || player.playerStatus;
      return player.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "player profile updated!", player: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProfiles = (req, res, next) => {
  Player.find({}, (err, players) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(players);
  });
};
