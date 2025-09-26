const { model } = require("mongoose");
const User = require("../models/userModel");

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (err) {
    console.log(err.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      image: req.file.filename,
      is_admin: 0,
    });

    const userData = await user.save();
    if (userData) {
      res.render("registration", {
        message: "Your registration has been successed",
      });
    } else {
      res.render("registration", {
        message: "Your registration has been failed",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  loadRegister,insertUser
};
