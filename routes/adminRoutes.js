const express = require("express");
const adminController = require("../controllers/adminControllers");

const router = express.Router();

// router untuk render page
router.route("/").get(adminController.homePage);
router.route("/create").get(adminController.createPage);
router.route("/edit/:id").get(adminController.editPage);

// router untuk action
router.route("/action/delete/:id").get(adminController.removeCar);
router
  .route("/action/edit/:id")
  .post(adminController.upload.single("image"), adminController.editCar);
router
  .route("/action/create")
  .post(adminController.upload.single("image"), adminController.createCar);

module.exports = router;
