require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta http://localhost:${PORT} - Ambiente: ${process.env.NODE_ENV || 'development'}`);
    })
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

start();
