//validation
const Joi = require("@hapi/joi");

//register validate
const registerValidate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

//login validate

const loginValidate = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;
