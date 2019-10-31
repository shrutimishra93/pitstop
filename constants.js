exports.NODE_ENV = {
  LOCAL: 'local',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

exports.DATABASES = {
  testDatabase: {
    user: 'user',
    password: 'password',
    host: 'localhost',
    database: 'staging',
    port: 5432,
  },
  stagingDatabase: {
    user: 'user',
    password: 'password',
    host: 'localhost',
    database: 'staging',
    port: 5432,
  },
  productionDatabase: {
    user: 'user',
    password: 'password',
    host: 'localhost',
    database: 'staging',
    port: 5432,
  },
};

// export {NODE_ENV, DATABASES};
