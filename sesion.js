const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el módulo cors
const app = express();

app.use(cors()); // Utiliza cors como middleware
app.use(express.json()); // para poder parsear JSON

// Función para manejar la petición al servicio cuando el usuario tiene el rol 2
async function handleRole2(user) {
  if (user.rol === 2) {
    try {
      const response = await axios.get('https://7458-2800-e2-ba80-8ff-f5de-971e-28a9-4ef1.ngrok-free.app/api/turismo/getRandomTurismoId');
      console.log('Respuesta del servicio getRandomId:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud al servicio getRandomId:', error);
    }
  }
}

app.post('/login', async (req, res) => {
  // Aquí obtienes el nombre de usuario y la contraseña
  const { nombre, contraseña } = req.body;

  console.log(nombre, contraseña); // Imprime el nombre de usuario y la contraseña

  // Después de obtener el nombre de usuario y la contraseña, envía la notificación
  try {
    const response = await axios.post('https://d51f-45-65-234-17.ngrok-free.app/login', {
      nombre,
      contraseña
    });
    console.log('Respuesta del servidor:', response.data);

    // Si la respuesta del servidor es exitosa, envía la respuesta al cliente
    if (response.data) {
      const randomIdResponse = await handleRole2(response.data);
      if (randomIdResponse) {
        const datoID = randomIdResponse.id; // Guarda el id en la variable datoID
        // Enviar el datoID a la API crearResena
        try {
          const resenaResponse = await axios.post('https://d51f-45-65-234-17.ngrok-free.app/crearResena', {
            valor: 0,
            comentario: '',
            usuarioID: response.data.id,
            datoID: datoID,
            estadoID: 1
          });
          console.log('Respuesta del servicio crearResena:', resenaResponse.data);
        } catch (error) {
          console.error('Error al enviar la solicitud al servicio crearResena:', error);
        }
      }
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: response.data,
        randomId: randomIdResponse
      });
    } else {
      res.json({
        success: false,
        message: 'Inicio de sesión fallido'
      });
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
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








