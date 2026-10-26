const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Carga = db.define('carga',{
    codCarga: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    peso: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codRastreio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idMotorista: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            Key: 'codMotorista',
            model: 'motoristas'
        }
    },
},{
    timestamps: false,
    tableName: 'cargas'
})
module.exports = Carga