const Joi = require ('joi');

const doctorSchema = Joi.object({
    name: Joi.string().min(1).max(30).pattern(/^[a-zA-Z\s'-]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^[a-zA-Z0-9\s'-]+$/).optional(),
    specialization: Joi.string().required(),
    availableSlots: Joi.array().items(Joi.string()).optional()
    
});


const patientSchema = Joi.object({
    name: Joi.string().min(1).max(30).pattern(/^[a-zA-Z\s'-]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^[a-zA-Z0-9\s'-]+$/).optional(),

});


const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^[a-zA-Z0-9\s'-]+$/).required(),

});


const doctorRegistration = (req, res, next) => {
    const { value, error } = doctorSchema.validate(req.body);

    if(error) {
        return res.status(400).json(error.details[0].message);
    }

    req.body = value;
    next();
};


const patientRegistration = (req, res, next) => {
    const { value, error } = patientSchema.validate(req.body);

    if(error) {
        return res.status(400).json(error.details[0].message);
    }

    req.body = value;
    next();
};


const login = (req, res, next) => {
    const { value, error } = loginSchema.validate(req.body);

    if(error) {
        return res.status(400).json(error.details[0].message);
    }

    req.body = value;
    next();
};



module.exports = { doctorRegistration, patientRegistration, login };