const { Joi } = require('celebrate');

const loginDetail = {
    body:Joi.object().keys({
        email:Joi.string().required(),
        password:Joi.string().required()
    })

};

module.exports = { loginDetail }