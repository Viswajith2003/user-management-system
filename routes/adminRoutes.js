const express = require("express");
const admin_route = express();

const adminAuth = require("../middleware/adminAuth");

const session = require("express-session");
const config = require("../config/config");

// Proper session setup
admin_route.use(
  session({
    secret: config.sessionSecret,
  })
);

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

// Views for admin
admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

const adminController = require("../controllers/adminController");

// Routes
admin_route.get("/", adminAuth.isLogout, adminController.loadLogin);
admin_route.post("/", adminController.verifyLogin);
admin_route.get("/adminDash", adminAuth.isLogin, adminController.loadDashboard);
admin_route.get("/logout", adminAuth.isLogin, adminController.logOut);

admin_route.get("/forget", adminAuth.isLogout, adminController.loadForget);
admin_route.post("/forget", adminController.verifyForget);
admin_route.get(
  "/forget-password",
  adminAuth.isLogout,
  adminController.forgetPasswordLoad
);
admin_route.post("/forget-password", adminController.resetPassword);

// Catch-all route (404 handler or redirect)
admin_route.use((req, res) => {
  res.redirect("/admin");
});

module.exports = admin_route;
