const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de Middleware
app.use(cors());
app.use(express.json());

// --- Rutas de API ---
app.use('/api/auth', authRoutes);
app.use('/api/inventory', productRoutes); // El frontend espera esta ruta
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// Ruta de Salud (Check)
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Backend Colegio Estudio Listo' }));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`Backend Colegio Estudio Corriendo en Puerto: ${PORT}`);
    console.log(`Rutas habilitadas: /api/auth, /api/inventory, /api/users, /api/loans`);
    console.log(`--------------------------------------------------`);
});
