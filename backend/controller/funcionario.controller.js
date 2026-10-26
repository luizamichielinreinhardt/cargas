const Funcionario = require('../models/Funcionario')
const CryptoJs = require('crypto-js')
const CHHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.nome|| !valores.email || !valores.senha){
        return res.status(400).json({message: 'Todos os valores são obrigatorios'})
    }

    try {
        const senhaCriptografada = CryptoJs.AES.encrypt(valores.senha, CHHAVE_SECRETA).toString()

         await Funcionario.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada
         })

         return res.status(201).json({message: 'funcionario criado com sucesso'})
    } catch (err) {
        console.error('erro ao cadastrar funcionario',err)
        return res.status(500).json({message: 'erro ao cadastrar funcionario'})
    }
}

module.exports = {cadastrar}