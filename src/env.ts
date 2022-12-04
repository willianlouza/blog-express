import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 8080,
  DATABASE_URL: process.env.DATABASE_URL || "",
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUD_KEY: process.env.CLOUD_KEY || "",
  CLOUD_SECRET: process.env.CLOUD_SECRET || "",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "",
};
