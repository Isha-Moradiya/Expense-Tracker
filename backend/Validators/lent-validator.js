import Joi from "joi";

export const validateLentData = (data) => {
  const schema = Joi.object({
    lender: Joi.string().required(),
    borrower: Joi.string().required(),
    borrowerEmail: Joi.string().email().required(),
    initialAmount: Joi.number().greater(0).required(),
    remainingAmount: Joi.number().min(0).required(),
    description: Joi.string().allow(""),
  });

  return schema.validate(data);
};
