const { model } = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const securePassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err.message);
  }
};

const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: "22l025@gecskp.ac.in",
      to: email,
      subject: "For Verification mail",
      html:
        "<p>Hii " +
        name +
        ', please click here to <a href="http://127.0.0.1:3005/verify?id=' +
        user_id +
        '">Verify</a> your mail.</p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been send:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
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
      sendVerifyMail(req.body.name, req.body.email, userData._id);
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

const verifyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );
    console.log(updateInfo);
    res.render("email-verified", {
      message: "Your email has been successfully verified 🎉",
    });
  } catch (error) {
    console.log(error.message);
    res.render("email-verified", {
      message: "Email verification failed ❌, please try again.",
    });
  }
};

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const verifiyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const pswdMatch = await bcrypt.compare(password, userData.password);
      if (pswdMatch) {
        if (userData.is_verified === 0) {
          res.render("login", { message: "Please verify your mail" });
        } else {
          req.session.user_id=userData._id;
          res.redirect("/home");
        }
      } else {
        res.render("login", { message: "Your Password is incorrect" });
      }
    } else {
      res.render("login", { message: "Email and password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  verifyMail,
  loginLoad,
  verifiyLogin,
  loadHome,
};
