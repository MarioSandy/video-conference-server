const express = require("express");
const passport = require("passport");
const login = require("../controller/auth/login");
const logout = require("../controller/auth/logout");
const oAuthLogin = require("../controller/auth/oAuthLogin");
const refreshToken = require("../controller/auth/refreshToken");
const register = require("../controller/auth/register");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh-token").get(refreshToken);

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// router.route("/google/callback").get(
//   passport.authenticate("google", {
//     // successRedirect: "http://127.0.0.1:3000",
//     // failureRedirect: "http://127.0.0.1:3000/login",
//     // failureFlash: "Invalid Google credentials.",
//     session: false,
//   }),
//   (req, res) => {
//     console.log(req.user_id);
//   }
// );

// router.route("/google/callback").get((req, res) => {
//   // console.log("halo");
//   passport.authenticate("google", (err, user, info) => {
//     console.log(user);
//     oAuthLogin(req, res, user._json);
//   });
// });

module.exports = router;
