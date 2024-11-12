const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Patient = require('./patient.js');
const Doctor = require('./doctor.js');

const Consultation = db.define('Consultation', {
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending', 
    },
    slot: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reason: { 
        type: DataTypes.TEXT,
        allowNull: true, 
    },
    description: { 
        type: DataTypes.TEXT,
        allowNull: true, 
    },
}, {
    timestamps: true,
});

// Associations
Patient.hasMany(Consultation, { foreignKey: 'patientId' });
Consultation.belongsTo(Patient, { foreignKey: 'patientId' });
Doctor.hasMany(Consultation, { foreignKey: 'doctorId' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });



module.exports = Consultation;