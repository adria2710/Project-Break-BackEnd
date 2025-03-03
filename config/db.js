const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'test' 
      ? process.env.MONGO_URI_TEST 
      : process.env.MONGO_URI;
      
    if (!uri) {
      throw new Error("La variable de entorno de conexión no está definida.");
    }
    
    await mongoose.connect(uri);
    console.log("🔥 Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;