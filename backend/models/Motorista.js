const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Motorista = db.define('motorista',{
    codMotorista: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CNH: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    timestamps: false,
    tableName: 'motoristas'
})
module.exports = Motorista