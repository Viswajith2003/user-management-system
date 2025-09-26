const { model } = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (err) {
    console.log(err.message);
  }
};

const insertUser = async (req, res) => {
  const spassword = await securePassword(req.body.password);
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      image: req.file.filename,
      is_admin: 0,
    });

    const userData = await user.save();
    if (userData) {
      res.render("registration", {
        message:
          "Your registration has been successed, Please verify your mail",
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
  loadRegister,
  insertUser,
};
