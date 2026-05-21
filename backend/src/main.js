const express = require('express');
const cors = require('cors');
// Importar rutas
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

// Conectar la ruta de autenticación
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Conectar la ruta del menú
app.use('/api/menu', require('./routes/menuRoutes'));

//Ruta Pedidos
app.use('/api/pedidos', require('./routes/pedidoRoutes'));

// Ruta Blog
app.use('/api/blog', require('./routes/blogRoutes'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
