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

        const bytes = CryptoJS.AES.decrypt(funcionario.senha, CHAVE_SECRETA)
        console.log(bytes)
        const senhaBD = bytes.toString(CryptoJS.enc.Utf8)
        console.log(senhaBD)

        if (valores.senha !== senhaBD) {
            return res.status(401).json({message: 'senha incorreta'})
        }

        const tresHorasEmMs = 3 * 60 * 60 * 1000
        const tempoExpiracao = Date.now() + tresHorasEmMs

        const payload = {
            idFuncionario: funcionario.codFuncionario,
            nome: funcionario.nome,
            expiraEm: tempoExpiracao
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
            nome: funcionario.nome
        })
    } catch (err) {
        console.erro('erro ao fazer login',err)
        return res.status(500).json({message: 'erro ao tentar fazer login'})
    }
}

module.exports = { login }