// db.js
const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://JuanPablo:conexionDB@cluster0.2ykros2.mongodb.net/miBaseDeDatos?retryWrites=true&w=majority&appName=Cluster0";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

module.exports = connectToDatabase;



