const express = require("express");
const adminController = require("../controllers/adminControllers");
const imageUploader = require("./../middlewares/imageUploader");

const router = express.Router();

// router untuk render page
router.route("/dashboard/").get(adminController.homePage);
router.route("/dashboard/create").get(adminController.createPage);
router.route("/dashboard/edit/:id").get(adminController.editPage);

// router untuk action
router.route("/car/delete/:id").get(adminController.removeCar);
router
  .route("/car/edit/:id")
  .post(imageUploader.single("image"), adminController.editCar);
router
  .route("/car/create")
  .post(imageUploader.single("image"), adminController.createCar);

module.exports = router;
