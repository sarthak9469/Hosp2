const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
// const Consultation = require('./consultation');

const Doctor = db.define('Doctor', {
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false,
    },
    specialization: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    availableSlots: { 
        type: DataTypes.JSON, 
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Doctor.sync({ alter: true });

// Doctor.hasMany(Consultation, { foreignKey: 'doctorId' });
// Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });


module.exports = Doctor;