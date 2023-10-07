const Car = require("../models/carsModel");
const imagekit = require("../lib/imagekit");

const uploadImage = async (file) => {
  try {
    const split = file.originalname.split(".");
    const extension = split[split.length - 1];

    const img = await imagekit.upload({
      file: file.buffer,
      fileName: `IMG-${Date.now()}.${extension}`,
    });
    return img;
  } catch (err) {
    return err.message;
  }
};

const homePage = async (req, res) => {
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
  try {
    const img = await uploadImage(req.file);
    console.log("img: ");
    console.log(img);
    let data = {
      ...req.body,
      imageUrl: img.url,
      dateUpdated: req.date,
    };

    await Car.create(data);

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
      const img = await uploadImage(req.file);
      updatedData.imageUrl = img.url;
    }

    await Car.findByIdAndUpdate(id, updatedData, {
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
    const car = await Car.findById(id);
    if (!car) {
      return res.status(400).json({
        status: "failed",
        message: "id not found",
      });
    }

    await Car.findByIdAndRemove(id);

    req.flash("msg", "Data Berhasil Dihapus");
    res.redirect("/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
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
  homePage,
  createCar,
  createPage,
  editCar,
  removeCar,
  editPage,
};
