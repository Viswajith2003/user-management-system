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

const multer = require("multer");
const path = require("path");

admin_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

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

admin_route.get("/profile", adminAuth.isLogin, adminController.loadProfile);

admin_route.get("/newUser", adminAuth.isLogin, adminController.loadNewUser);
admin_route.post("/newUser", upload.single("image"), adminController.addUser);

// Catch-all route (404 handler or redirect)
admin_route.use((req, res) => {
  res.redirect("/admin");
});

module.exports = admin_route;
