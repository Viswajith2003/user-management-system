const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passMatch = await bcrypt.compare(password, userData.password);
      if (passMatch) {
        if (userData.is_admin === 1) {
          req.session.user_id = userData._id;
          res.redirect("/admin/adminDash");
        } else {
          res.render("login", { message: "Please verify your mail" });
        }
      } else {
        res.render("login", { message: "password is incorrect" });
      }
    } else {
      res.render("login", { message: "email and password are incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    res.render("adminDash");
  } catch (error) {
    console.log(error.message);
  }
};
const logOut = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logOut,
};
