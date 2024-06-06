// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: String,
  contraseña: String,
  rol: Number,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;





