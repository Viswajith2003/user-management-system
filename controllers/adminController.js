const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { use } = require("../routes/adminRoutes");

const securePassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err.message);
  }
};

const sendResetPasswordMail = async (name, email, token) => {
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <p>Hi ${name},</p>
        <p>Please click the link below to reset your password:</p>
        <a href="http://127.0.0.1:3005/admin/forget-password?token=${token}">
          Reset Password
        </a>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("❌ Mail Error:", error);
      } else {
        console.log("✅ Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

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
    const userData=await User.find({is_admin:0})
    res.render("adminDash",{Users:userData});
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
const loadForget = async (req, res) => {
  try {
    res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyForget = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.is_verified === 0) {
        res.render("forget", { message: "Please verify your mail." });
      } else {
        const randomString = randomstring.generate();
        const updatedData = await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );

        sendResetPasswordMail(userData.name, userData.email, randomString);
        res.render("forget", {
          message: "Please check your mail to reset your password",
        });
      }
    } else {
      res.render("forget", { message: "User email is incorrect." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPasswordLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    console.log("Generated token:", token);

    if (tokenData) {
      res.render("forget-password", { user_id: tokenData._id });
    } else {
      res.render("404", { message: "Token is invalid" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    const secure_password = await securePassword(password);

    const updatedData = await User.findByIdAndUpdate(user_id, {
      $set: { password: secure_password, token: "" },
    });

    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const loadProfile = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("profile", { admin: userData });
  } catch (error) {
    // res.status(404).render("404", { message: "Profile not loaded" });
    console.log(error.message);
  }
};




module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logOut,
  loadForget,
  verifyForget,
  sendResetPasswordMail,
  forgetPasswordLoad,
  resetPassword,
  loadProfile,
};
