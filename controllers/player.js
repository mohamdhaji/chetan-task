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
  const playerStatus = {
    overPlayed: null,
    runsChase: null,
    difficulty: "",
    score: null,
    strikeRate: null,
    runRate: null,
  };

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
      res.status(201).json({ message: "Player created!", player: result });
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
  Player.findOne({ name: name, contactNumber: contactNumber })
    .then((player) => {
      if (!player) {
        const error = new Error("name or contact number is not correct");
        error.statusCode = 401;
        throw error;
      }
      var options = {
        method: "GET",
        url: `http://otpsms.vision360solutions.in/api/sendhttp.php?authkey=${process.env.OTPSMS_KEY}&mobiles=${contactNumber}&message=your otp is 1234&sender=Vision&route=4&country=91`,
        headers: {
          Cookie: process.env.OTPSMS_COOKIE,
        },
      };
      request(options, async (error, response) => {
        if (error) throw new Error(error);
        player.Active = true;
        player.playerStatus.MatchesPlayed =
          player.playerStatus.MatchesPlayed + 1;
        await player.save();
        res.status(200).json({ otp: response.body.slice(-5), player: player });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProfile = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

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
