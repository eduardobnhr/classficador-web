import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  API_PORT: Joi.number().required(),

  ENVIRONMENT: Joi.string().required(),

  URL_AUTORIZADA_CORS: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),


  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});
