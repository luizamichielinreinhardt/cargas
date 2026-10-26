const db = require('./db/conn')
const {Funcionario, Motorista, Carga, Entrega} = require('./models/rel')

async function syncDataBase() {
    try {
       await db.sync({force: true})
       console.log('scincronizando o banco de dados') 
    } catch (err) {
        console.error('Erro ao rodar o banco')
    }finally{
        await db.close()
        console.log('fechando o banco de dados')
    }
}
syncDataBase()