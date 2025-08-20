import Joi from "joi";

const createTransactionSchema = Joi.object({
  title: Joi.string().max(100).required(),
  amount: Joi.number().integer().required(),
  type: Joi.string().valid("pemasukkan", "pengeluaran").required(),
});

const updateTransactionSchema = Joi.object({
  title: Joi.string().max(100),
  amount: Joi.number().integer(),
  type: Joi.string().valid("pemasukkan", "pengeluaran"),
});

export { createTransactionSchema, updateTransactionSchema };
