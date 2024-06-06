const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el módulo cors
const app = express();

app.use(cors()); // Utiliza cors como middleware
app.use(express.json()); // para poder parsear JSON

// Función para manejar la petición al servicio cuando el usuario tiene el rol 2
async function handleRole2(user) {
  let datoID = null; // Inicializa datoID como null
  if (user.rol === 2) {
    try {
      const response = await axios.get('https://c059-2800-e2-ba80-8ff-149e-ce2-f63f-b9f1.ngrok-free.app/api/turismo/getRandomTurismoId');
      console.log('Respuesta del servicio getRandomId:', response.data);
      datoID = response.data.randomId; // Guarda el randomId en datoID

      // Enviar el datoID a la API crearResena
      console.log('Valor de datoID antes de llamar a crearResena:', datoID);
      console.log('Llamando a crearResena con los siguientes datos:', {
        valor: 0,
        comentario: '',
        usuarioID: user.id,
        datoID: datoID ? String(datoID) : null, // Convierte datoID a un string solo si no es undefined
        estadoID: 1
      });
      try {
        const resenaResponse = await axios.post('https://8add-45-65-234-17.ngrok-free.app/crearResena', {
          valor: 0,
          comentario: '',
          usuarioID: user.id,
          datoID: datoID ? String(datoID) : null,
          estadoID: 1
        });
        console.log('Respuesta del servicio crearResena:', resenaResponse.data);
      } catch (error) {
        console.error('Error al enviar la solicitud al servicio crearResena:', error);
      }

    } catch (error) {
      console.error('Error al enviar la solicitud al servicio getRandomId:', error);
    }
  }
  return datoID; // Devuelve datoID
}

app.post('/login', async (req, res) => {
  // Aquí obtienes el nombre de usuario y la contraseña
  const { nombre, contraseña } = req.body;

  console.log(nombre, contraseña); // Imprime el nombre de usuario y la contraseña

  // Después de obtener el nombre de usuario y la contraseña, envía la notificación
  try {
    const response = await axios.post('https://8add-45-65-234-17.ngrok-free.app/login', {
      nombre,
      contraseña
    });
    console.log('Respuesta del servidor:', response.data);

    // Si la respuesta del servidor es exitosa, envía la respuesta al cliente
    if (response.data) {
      const datoID = await handleRole2(response.data); // Guarda el valor devuelto por handleRole2 en datoID
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: response.data,
        datoID: datoID // Cambia randomId a datoID
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





























