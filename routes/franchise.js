const express = require("express");
const { body } = require("express-validator");
const Franchise = require("../models/franchise");
const franchiseController = require("../controllers/franchise");

const router = express.Router();

router.post("/login", franchiseController.login);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Franchise.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("macAddress")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your MAC Address"),
    body("name").trim().not().isEmpty().withMessage("Please enter your name"),
    body("contactNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your contact number"),
    body("deviceSerialNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your Device serial number"),
  ],
  franchiseController.signup
);

// router.post("/login", playerController.login);

router.post(
  "/",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Franchise.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("macAddress")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your MAC Address"),
    body("name").trim().not().isEmpty().withMessage("Please enter your name"),
    body("contactNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your contact number"),
    body("deviceSerialNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your Device serial number"),
  ],

  franchiseController.createProfile
);
router.put("/:franchiseId", franchiseController.updateProfile);
router.get("/", franchiseController.getProfiles);

module.exports = router;