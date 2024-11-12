// models/Image.js
const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Consultation = require('./consultation'); 

const Image = db.define('Image', {
    consultationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Consultation,
            key: 'id'
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Associations
Consultation.hasMany(Image, { foreignKey: 'consultationId' });
Image.belongsTo(Consultation, { foreignKey: 'consultationId' });

module.exports = Image;