import * as Joi from 'joi';

/**
 * Validates process.env at bootstrap so the app fails fast with a clear
 * error instead of booting into a broken/insecure state (e.g. a missing
 * JWT secret silently becoming `undefined`).
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(5000),
  HOST: Joi.string().default('0.0.0.0'),
  MONGODB_URI: Joi.string().uri().required(),

  ACCESS_TOKEN_KEY: Joi.string().min(32).required(),
  ACCESS_TOKEN_TIME: Joi.string()
    .pattern(/^\d+(ms|s|m|h|d|w|y)?$/)
    .default('15h'),
  REFRESH_TOKEN_KEY: Joi.string().min(32).required(),
  REFRESH_TOKEN_TIME: Joi.string()
    .pattern(/^\d+(ms|s|m|h|d|w|y)?$/)
    .default('15d'),
  COOKIE_TIME: Joi.number().default(1296000000),

  CORS_ORIGINS: Joi.string().allow('').default(''),

  API_HOST: Joi.string().optional(),
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  REDIS_URL: Joi.string().optional(),
}).unknown(true);
