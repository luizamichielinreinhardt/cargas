const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

function authMiddleware(req,res,next){
    const token = req.headers['authorization']
    console.log(token)

    if (!token) {
        return res.status(401).json({message: 'Acesso negato! token nao fornecido'})
    }

    try {
        const bytes = CryptoJS.AES.decrypt(token,CHAVE_SECRETA)
        const dadosDescriptografados = bytes.toString(CryptoJS.enc.Utf8)

        if (!dadosDescriptografados) {
            return res.status(401).json({message: 'Token Invalido'})
        }

        const payload  = JSON.parse(dadosDescriptografados)

        if (Date.now() > payload.expiraEm) {
            return res.status(401).json({message: 'sessão expirada! faça login novamente'})
        }

        req.usuario = payload
        next()
    } catch (err) {
        return res.status(401).json({message: 'Falha na autenticaçao do token'})
    }
}

module.exports = authMiddleware