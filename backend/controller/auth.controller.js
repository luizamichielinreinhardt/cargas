const Funcionario = require('../models/Funcionario')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const login = async(req,res)=>{
    valores = req.body

    if (!valores.email || !valores.senha) {
        return res.status(400).json({message: 'Informe email e senha para atualizar  login'})
    }

    try {
        const funcionario = await Funcionario.findOne({where: {email: valores.email}})

        if (!funcionario) {
            return res.status(404).json({message: 'Funcionario nao encontrado'})
        }

        const bytes = CryptoJS.AES.decrypt
    } catch (error) {
        
    }
}