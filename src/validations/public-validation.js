import Joi from "joi";

const registerSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

export { registerSchema, loginSchema };
