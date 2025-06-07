require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "default_super_secret_key_for_dev", // Use environment variable in production
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};

