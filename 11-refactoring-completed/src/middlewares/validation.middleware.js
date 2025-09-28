export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const validationErrors = error.errors.map((err) => err.message);
    res.status(400).json({ errors: validationErrors });
  }
};
