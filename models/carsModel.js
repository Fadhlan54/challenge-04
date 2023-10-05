const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama tour harus ada"],
  },
  price: {
    type: Number,
    required: [true, "Harga nya harus ada"],
  },
  category: {
    type: String,
    required: [true, "ukuran harus diisi"],
  },
  image: {
    type: String,
    required: [true, "Foto harus diisi"],
  },
  dateUpdated: {
    type: String,
    required: [true, "Harus ada dateUpdated"],
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
