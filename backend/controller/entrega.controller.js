const Entrega = require('../models/Entrega')
const Carga = require('../models/Carga')
const CryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if (!valores.cidadeDestino || !valores.status ||!valores.data ||!valores.hora ||!valores.cidadeDestino ||!valores.idCarga) {
      return res.status(400).json({message: 'Todos os campos sao obrigatorios'})  
    }

    try{
        const carga = await Carga.findByPk(valores.idCarga)
        if (!carga) {
            return res.status(404).json({message: 'carga nao encotrada'})
        }

        const novaEntrega = await Entrega.create(valores)
        return res.status(201).json({message: 'Entrega criada com sucesso', Entrega: novaEntrega})
    } catch(err){
        console.error('erro ao cadastrar entrega',err)
        return res.status(500).json({message: 'Erro ao cadastrar entrega'})
    }
}

module.exports = {cadastrar}