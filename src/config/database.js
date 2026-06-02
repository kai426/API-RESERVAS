require('dotenv').config();

const parseSslOptionsFromUrl = () => {
  if (!process.env.DATABASE_URL) return {};
  try {
    const url = new URL(process.env.DATABASE_URL);
    const sslmode = url.searchParams.get('sslmode');
    if (sslmode === 'require') {
      return {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      };
    }
  } catch (e) {
    // noop
  }
  return {};
};

const sslOptions = parseSslOptionsFromUrl();

module.exports = {
  development: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        define: {
          timestamps: true,
          underscored: false,
        },
        ...sslOptions,
      }
    : {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'reservas_db',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        dialect: 'postgres',
        logging: false,
        define: {
          timestamps: true,
          underscored: false,
        },
      },

  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'reservas_db_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
  },

  production: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        ...sslOptions,
      }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      },
};