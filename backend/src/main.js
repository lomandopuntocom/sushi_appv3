const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

// Endpoint de prueba (El primer paso para tu rúbrica)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '¡El backend de Sushi App está vivo!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});