const Car = require("../models/carsModel");

const fs = require("fs");
const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../public/car_images`);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

const getAllCars = async (req, res) => {
  try {
    const { name, category } = req.query;
    console.log(name);
    console.log(category);

    const condition = {};
    if (name) {
      condition.name = { $regex: new RegExp(name, "i") };
    }
    if (category) {
      condition.category = { $eq: category };
    }
    const cars = await Car.find().where(condition);

    res.render("index", {
      cars,
      category,
      name,
      message: req.flash("msg"),
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const createCar = async (req, res) => {
  console.log(`create req.body:`);
  console.log(req.body);
  try {
    let data = {
      ...req.body,
      image: req.file.filename,
      dateUpdated: req.date,
    };

    const newCar = await Car.create(data);
    req.flash("msg", "Data Berhasil Disimpan");
    res.status(201).redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const editCar = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = {
      ...req.body,
      image: req.file.filename,
      dateUpdated: req.date,
    };
    const carData = await Car.findById(id);

    if (!carData) {
      return res.status(400).json({
        status: "failed",
        message: "data with this id is not defined",
      });
    }

    if (req.file) {
      const oldFileName = carData.image;
      const oldFilePath = path.join(
        `${__dirname}/../public/car_images`,
        oldFileName
      );

      fs.unlink(oldFilePath, (err) => {
        if (err) {
          res.status(500).json({
            status: "failed",
            message: `Error when deleting file: ${err.message}`,
          });
        }
        updatedData.image = req.file.fileName;
      });
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    req.flash("msg", "Data Berhasil Disimpan");
    res.redirect("/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const removeCar = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteCar = await Car.findByIdAndRemove(id);
    if (!deleteCar) {
      return res.status(400).json({
        status: "failed",
        message: "id not found",
      });
    }
    const fileName = deleteCar.image;
    const filePath = path.join(`${__dirname}/../public/car_images`, fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(500).json({
          status: "failed",
          message: err,
        });
      }
      req.flash("msg", "Data Berhasil Dihapus");
      res.redirect("/dashboard");
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const createPage = (req, res) => {
  try {
    const name = req.query.name;
    res.render("create", {
      name,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const editPage = async (req, res) => {
  try {
    const name = req.query.name;
    const id = req.params.id;
    const car = await Car.findById(id);
    res.render("edit", {
      car,
      name,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = {
  getAllCars,
  createCar,
  createPage,
  editCar,
  removeCar,
  editPage,
  upload,
};
