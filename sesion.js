const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

async function handleRole2(user) {
  if (user.rol !== 2) return null;

  try {
    const { data: datoID } = await axios.get('https://c059-2800-e2-ba80-8ff-149e-ce2-f63f-b9f1.ngrok-free.app/api/turismo/getRandomTurismoId');
    console.log('Respuesta completa del servicio getRandomId:', datoID);

    if (datoID !== null) {
      const resenaPayload = {
        valor: 0,
        comentario: '',
        usuarioID: user.id,
        datoID: String(datoID),
        estadoID: 1
      };
      console.log('Llamando a crearResena con los siguientes datos:', resenaPayload);

      const resenaResponse = await axios.post('https://mongo-sesion-latest.onrender.com/crearResena', resenaPayload);
      console.log('Respuesta del servicio crearResena:', resenaResponse.data);
    } else {
      console.error('datoID es nulo después de llamar a getRandomId');
    }

    return datoID;
  } catch (error) {
    console.error('Error al manejar la solicitud para el rol 2:', error);
    return null;
  }
}

app.post('/login', async (req, res) => {
  const { nombre, contraseña } = req.body;
  console.log(nombre, contraseña);

  try {
    const { data } = await axios.post('https://mongo-sesion-latest.onrender.com/login', { nombre, contraseña });
    console.log('Respuesta del servidor:', data);

    if (data) {
      const datoID = await handleRole2(data);
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data,
        datoID
      });
    } else {
      res.json({
        success: false,
        message: 'Inicio de sesión fallido'
      });
    }
  } catch (error) {
    console.error('Error al enviar la solicitud de inicio de sesión:', error);
    res.json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});







































