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
      .withMessage("Please enter your contact number")
      .custom((value, { req }) => {
        return Franchise.findOne({ contactNumber: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("contact number already exists!");
          }
        });
      }),
    body("deviceSerialNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your Device serial number"),
  ],
  franchiseController.signup
);

router.put(
  "/:franchiseId",
  [
    body("name").trim().not().isEmpty().withMessage("Please enter your name"),
    body("active")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter active status"),
  ],
  franchiseController.updateProfile
);
router.get("/", franchiseController.getProfiles);

module.exports = router;
