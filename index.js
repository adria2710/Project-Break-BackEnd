const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const session = require('express-session');

const app = express();
connectDB();

app.use(session({
  secret: 'tu-clave-secreta', 
  resave: false,
  saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use('/', authRoutes);

const authMiddleware = require('./middlewares/authMiddleware');
app.use('/dashboard', authMiddleware, productRoutes); 
app.use('/', productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a la Tienda de Ropa</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});