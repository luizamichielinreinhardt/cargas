const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const funcionarioController = require('./controller/funcionario.controller')
const cargaController = require('./controller/carga.controller')
const motoristaController = require('./controller/motorista.controller')
const entregaController = require('./controller/entrega.controller')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// FUNCIONARIO
app.post('/funcionario', funcionarioController.cadastrar)

// LOGIN
app.post('/login', authController.login)

// ROTA PRINCIPAL
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Sistema de Gestao e Rastreamento de Encomendas'
    })
})

// PROTEGE AS ROTAS ABAIXO
app.use(authMiddleware)

// MOTORISTA
app.post('/motorista', motoristaController.cadastrar)
app.get('/motorista', motoristaController.listar)
app.get('/motorista/buscarNome/:nome', motoristaController.consultarNome)
app.get('/motorista/:id', motoristaController.consultar)
app.put('/motorista/:id', motoristaController.atualizar)
app.delete('/motorista/:id', motoristaController.apagar)

// CARGA
app.post('/carga', cargaController.cadastrar)

// ENTREGA
app.post('/entrega', entregaController.cadastrar)
app.get('/entrega', entregaController.listar)
app.put('/entrega/:id', entregaController.atualizar)

// SINCRONIZAR BANCO E INICIAR SERVIDOR
conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao conectar com o banco de dados!', err)
    })