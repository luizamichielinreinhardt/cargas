const Carga = require('../models/Carga')
const Motorista = require('../models/Motorista')

const cadastrar = async(req,res)=> {
    const valores = req.body

    if (!valores.descricao || !valores.peso || !valores.volume ||!valores.codRastreio || !valores.idMotorista) {
        return res.status(400).json({message: 'Todos os dados sao obrigatorios'})
    }

    try {
        const motorista = await Motorista.findByPk(idMotorista)
        if (!motorista) {
            return res.status(404).json({message: 'Motorista nao encontrado'})
        }

        await Carga.create(valores)
        return res.status(200).json({message: 'Carga criada com sucesso'})
    } catch (err) {
        console.error('Erro ao criar carga',err)
        return res.status(500).json({message: 'Erro ao criar carga'})
    }
}

module.exports = {cadastrar}
