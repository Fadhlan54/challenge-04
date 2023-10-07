// SDK initialization

var ImageKit = require("imagekit");

var imagekit = new ImageKit({
  publicKey: "public_t9le5UOcTdRDwLOldiq+6lEm2CI=",
  privateKey: "private_s1O2Fgi0tnoYNYAst1zxQ0mxBrk=",
  urlEndpoint: "https://ik.imagekit.io/96gmelvyq",
});

module.exports = imagekit;
