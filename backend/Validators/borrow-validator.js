import Joi from "joi";

export const validateBorrowInput = (data) => {
  const schema = Joi.object({
    borrower: Joi.string().required(),
    lender: Joi.string().required(),
    lenderEmail: Joi.string().email().required(),
    initialAmount: Joi.number().greater(0).required(),
    remainingAmount: Joi.number().min(0).required(),
    description: Joi.string().optional(),
  });
  return schema.validate(data);
};
