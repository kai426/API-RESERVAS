const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let sequelize;

// Ignoramos abstrações e testamos diretamente a variável de ambiente
if (process.env.DATABASE_URL) {
  console.log('🔌 [Sequelize] Conectando ao banco de dados remoto (NeonDB)...');

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necessário para o Neon
      },
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  });
} else {
  console.log('🏠 [Sequelize] DATABASE_URL não encontrada. Conectando ao banco local...');

  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Carregar os modelos
const User = require('./User')(sequelize);
const Room = require('./Room')(sequelize);
const Reservation = require('./Reservation')(sequelize);

const models = { User, Reservation, Room };

// Executar as associações
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };