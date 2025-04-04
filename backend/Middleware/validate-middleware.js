const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    console.log(err);
    const status = 422;
    const message = "Fill the input properly";
    const extraDetails = err.issues.map((issue) => ({
      field: issue.path.join("."), 
      message: issue.message, 
    }));

    const error = {
      status,
      message,
      extraDetails,
    };

    next(error);
  }
};

export default validate;
