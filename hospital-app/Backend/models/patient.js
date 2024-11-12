const { DataTypes } = require('sequelize');
const db = require('../config/db.js');

const Patient = db.define('Patient', {
    patientId: {
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
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Patient.sync({ alter: true });

module.exports = Patient;