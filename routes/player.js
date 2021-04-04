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
      .withMessage("Please enter your contact number"),
  ],
  playerController.signup
);

router.post(
  "/",
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
      .withMessage("Please enter your contact number"),
  ],

  playerController.createProfile
);
router.put("/:playerId", playerController.updateProfile);
router.get("/", playerController.getProfiles);

module.exports = router;