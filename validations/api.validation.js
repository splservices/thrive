const { Joi } = require('celebrate');

const loginDetail = {
    body:Joi.object().keys({
        email:Joi.string().required(),
        password:Joi.string().required()
    })
};

const registerDetail = {
    body:Joi.object().keys({
        name:Joi.string().required(),
        username:Joi.string().required(),
        email:Joi.string().required(),
        password:Joi.string().required()
    })
};

module.exports = { loginDetail, registerDetail };