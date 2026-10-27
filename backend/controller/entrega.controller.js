
const Entrega = require('../models/Entrega')
const Carga = require('../models/Carga')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.cidadeDestino || !valores.status ||
        !valores.data || !valores.hora || !valores.idCarga) {
        return res.status(400).json({
            message: 'Todos os campos sao obrigatorios'
        })
    }

    try {
        const carga = await Carga.findByPk(valores.idCarga)

        if (!carga) {
            return res.status(404).json({
                message: 'Carga nao encontrada'
            })
        }

        await Entrega.create(valores)

        return res.status(201).json({
            message: 'Entrega criada com sucesso'
        })

    } catch (err) {
        console.error('erro ao cadastrar entrega', err)
        return res.status(500).json({
            message: 'Erro ao cadastrar entrega'
        })
    }
}

const listar = async (req, res) => {
    try {
        const entregas = await Entrega.findAll({
            order: [['data', 'ASC']]
        })

        return res.status(200).json(entregas)

    } catch (err) {
        console.error('erro ao listar entregas', err)
        return res.status(500).json({
            message: 'Erro ao listar entregas'
        })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const entrega = await Entrega.findByPk(id)

        if (!entrega) {
            return res.status(404).json({
                message: 'Entrega nao encontrada'
            })
        }

        if (valores.status &&
            !['ENTREGUE', 'TRANSITO'].includes(valores.status)) {
            return res.status(400).json({
                message: 'Status invalido'
            })
        }

        await entrega.update(valores)

        return res.status(200).json({
            message: 'Entrega atualizada com sucesso'
        })

    } catch (err) {
        console.error('erro ao atualizar entrega', err)
        return res.status(500).json({
            message: 'Erro ao atualizar entrega'
        })
    }
}

module.exports = { cadastrar, listar, atualizar }
