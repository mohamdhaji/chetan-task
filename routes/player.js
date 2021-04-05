const express = require("express");
const { body } = require("express-validator");
const Player = require("../models/player");
const playerController = require("../controllers/player");

const router = express.Router();

router.post("/login", playerController.login);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Player.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("dateOfBirth")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your Date of birth"),
    body("name").trim().not().isEmpty().withMessage("Please enter your name"),
    body("contactNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your contact number")
      .custom((value, { req }) => {
        return Player.findOne({ contactNumber: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("contact number already exists!");
          }
        });
      }),
  ],
  playerController.signup
);

router.put(
  "/:playerId",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("dateOfBirth")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your Date of birth"),
    body("name").trim().not().isEmpty().withMessage("Please enter your name"),
    body("contactNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your contact number"),
      body("active")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter active status"),
  ],
  playerController.updateProfile
);

router.get("/", playerController.getProfiles);

module.exports = router;
