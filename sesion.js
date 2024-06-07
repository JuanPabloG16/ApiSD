const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

async function handleRole2(user) {
  if (user.rol !== 2) return null;

  try {
    const { data: datoID } = await axios.get('https://datos-turismo-latest.onrender.com/api/turismo/getRandomTurismoId');
    console.log('Respuesta completa del servicio getRandomId:', datoID);

    if (datoID !== null) {
      const resenaPayload = {
        id: generateUniqueId(), // Genera un id único numérico
        valor: 0,
        comentario: '',
        usuarioID: user.id,
        datoID: datoID,  
        estadoID: 1
      };
      console.log('Llamando a crearResena con los siguientes datos:', JSON.stringify(resenaPayload));

      const resenaResponse = await axios.post('https://mongo-sesion-latest.onrender.com/crearResena', resenaPayload);
      console.log('Respuesta del servicio crearResena:', resenaResponse.data);

      return resenaResponse.data;
    } else {
      console.error('datoID es nulo después de llamar a getRandomId');
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error('Error al manejar la solicitud para el rol 2:', error.response.data);
      console.error('Detalles adicionales del error:', error.response.status, error.response.headers);
    } else {
      console.error('Error al manejar la solicitud para el rol 2:', error.message);
    }
    return null;
  }
}

// Función para generar un id único numérico
function generateUniqueId() {
  return Math.floor(Math.random() * 1000000); // Cambia el rango según tus necesidades
}

app.post('/login', async (req, res) => {
  const { nombre, contraseña } = req.body;
  console.log(nombre, contraseña);

  try {
    const { data } = await axios.post('https://mongo-sesion-latest.onrender.com/login', { nombre, contraseña });
    console.log('Respuesta del servidor:', data);

    if (data) {
      const resenaData = await handleRole2(data);
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data,
        resenaData
      });
    } else {
      res.json({
        success: false,
        message: 'Inicio de sesión fallido'
      });
    }
  } catch (error) {
    console.error('Error al enviar la solicitud de inicio de sesión:', error.response ? error.response.data : error.message);
    res.json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
});

// Nueva ruta para actualizar una reseña
app.put('/updateResena', async (req, res) => {
  const { id, valor, comentario, usuarioID, datoID, estadoID } = req.body;
  console.log('Datos recibidos para actualizar la reseña:', req.body);

  try {
    const updateResponse = await axios.put(`https://mongo-sesion-latest.onrender.com/actualizarResena/${id}`, {
      valor,
      comentario,
      usuarioID,
      datoID,
      estadoID
    });
    console.log('Respuesta del servicio updateResena:', updateResponse.data);

    res.json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: updateResponse.data
    });
  } catch (error) {
    console.error('Error al enviar la solicitud para actualizar la reseña:', error.response ? error.response.data : error.message);
    res.json({
      success: false,
      message: 'Error al actualizar la reseña'
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});















































