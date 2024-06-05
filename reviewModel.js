//reviewModel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    _id: Number,
  valor: Number,
  comentario: String,
  usuarioID: mongoose.Schema.Types.ObjectId,
  datoID: String,
  estadoID: String,
});

const ReviewModel = mongoose.model("Reseña", reviewSchema);

module.exports = ReviewModel;

