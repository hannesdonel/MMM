const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'test_jwt_secret',
  CONNECTION_URI: process.env.CONNECTION_URI || 'mongodb://localhost:27017/MMM',
  PORT: process.env.PORT || 8080,
};

const { JWT_SECRET, CONNECTION_URI, PORT } = config;

export { JWT_SECRET, CONNECTION_URI, PORT };
