const Motorista = require('../models/Motorista')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.CNH || !valores.telefone || !valores.cpf) {
        return res.status(400).json({ message: 'Todos os valores sao obrigatorios' })
    }

    try {
        const CNHCriptografada = CryptoJS.AES.encrypt(valores.CNH, CHAVE_SECRETA).toString()
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()

        await Motorista.create({
            nome: valores.nome,
            CNH: CNHCriptografada,
            telefone: valores.telefone,
            cpf: cpfCriptografado
        })

        return res.status(201).json({ message: 'motorista criado com sucesso' })
    } catch (err) {
        console.error('erro ao cadastrar o motorista', err)
        return res.status(500).json({ message: 'erro ao criar motorista' })
    }
}

const listar = async (req, res) => {
    try {
        const motoristas = await Motorista.findAll()
        let resultado = []

        motoristas.forEach((el) => {
            let CNHDescriptografada = ''
            let cpfDescriptografado = ''

            try {
                const bytes1 = CryptoJS.AES.decrypt(el.CNH, CHAVE_SECRETA)
                const bytes2 = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)

                CNHDescriptografada = bytes1.toString(CryptoJS.enc.Utf8)
                cpfDescriptografado = bytes2.toString(CryptoJS.enc.Utf8)
            } catch (err) {
                CNHDescriptografada = 'Erro ao descriptografar CNH'
                cpfDescriptografado = 'Erro ao descriptografar cpf'

                console.error(CNHDescriptografada, cpfDescriptografado, err)
            }
            resultado.push({
                codMotorista: el.codMotorista,
                nome: el.nome,
                CNH: CNHDescriptografada,
                telefone: el.telefone,
                cpf: cpfDescriptografado
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('erro ao listar motoristas', err)
        return res.status(500).json({ message: 'erro ao listar motoristas' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista nhao encontrado' })
        }

        const bytes1 = CryptoJS.AES.decrypt(motorista.CNH, CHAVE_SECRETA)
        const bytes2 = CryptoJS.AES.decrypt(motorista.cpf, CHAVE_SECRETA)

        const CNHDescriptografada = bytes1.toString(CryptoJS.enc.Utf8)
        const cpfDescriptografado = bytes2.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codMotorista: motorista.codMotorista,
            nome: motorista.nome,
            CNH: CNHDescriptografada,
            telefone: motorista.telefone,
            cpf: cpfDescriptografado
        })
    } catch (err) {
        console.error('Erro ao consultar motorista', err)
        return res.status(500).json({ message: 'erro ao consultar motorista' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado' })
        }
        const dadosAtualizados = { ...valores }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 digitos' })
            }

            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }
            if (valores.senha) {
                dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
            }

            await Motorista.update(dadosAtualizados, { where: { codMotorista: id } })
            return res.status(200).json({ message: 'Motorista atualizado com sucesso' })
        } catch (err) {
            console.error('Erro ao atualizar motorista', err)
            return res.status(500).json({ message: 'Erro ao atualizar motorista' })
        }
    } 
        
const apagar = async(req,res)=>{
    const id = req.params.id
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({message: 'Motorista nao encontrado'})
        }

        await Motorista.destroy({where: {codMotorista: id}})
        return res.status(200).json({message: 'motorista excluido com sucesso'})
    } catch (err) {
        console.error('Erro ao apagar motorista',err)
        return res.status(500).json({message: 'Erro ao apagar o motorista'})
    }
}

const consultarPorNome = async(req,res)=>{
    const nome = req.params.nome

    try {
        const motorista = await Motorista.findOne({where: {nome: nome}})

        if(!motorista){
            return res.status(404).json({message: 'Motorista nao encontrado'})
        }

        const bytes = CryptoJS.AES.decrypt(motorista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codMotorista: motorista.codMotorista,
            nome: motorista.nome,
            CNH: motorista.CNH,
            cpf:cpfDescriptografado,
            telefone: motorista.telefone
        })
    } catch (err) {
        console.error('Erro ao consultar o motorisa por nome:',err)
        return res.status(500).json({message: 'erro ao consultar motorista por nome'})
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar, consultarPorNome }