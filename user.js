// user.js
const express = require("express");
const connectToDatabase = require("./db.js");
const UserModel = require("./userModel.js");
const ReviewModel = require("./reviewModel.js");

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuraciones adicionales de Express (si las tienes)

// Conéctate a la base de datos
connectToDatabase();

// Ruta para obtener usuarios de la colección "UserModel"
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// Ruta para obtener reseñas de la colección "Reseña"
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las reseñas" });
  }
});

// Ruta para agregar una nueva reseña a la colección "Reseña"
app.post("/reviewss", async (req, res) => {
  try {
    const { valor, comentario, usuarioID, datoID, estadoID } = req.body;

    const newReview = new ReviewModel({
      valor,
      comentario,
      usuarioID,
      datoID,
      estadoID,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la reseña" });
  }
});

// Otras rutas y configuraciones de Express (si las tienes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});




