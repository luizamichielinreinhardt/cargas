
const verificarLog = document.getElementById('verificar_log')
const tokenNav = localStorage.getItem('token')
const nomeNav = localStorage.getItem('nomeFuncionario')
if (verificarLog) {
    if (tokenNav) {
        verificarLog.innerHTML = `<span class="titulo_menu">${nomeNav || 'Funcionário autenticado'}</span> <a href="#" id="btn_logout">Logout</a>`
        document.getElementById('btn_logout').addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.removeItem('token')
            localStorage.removeItem('nomeFuncionario')
            location.href = '../index.html'
        })
    } else {
        verificarLog.innerHTML = '<a href="./login.html">Login</a>'
    }
}

const token = localStorage.getItem('token')
const resposta = document.getElementById('resposta')
function mostrarMensagem(msg) { if (resposta) resposta.textContent = msg }
function escapar(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }
function requisicao(url, metodo = 'GET', valores = null) {
    const opcoes = { method: metodo, headers: { 'Content-Type': 'application/json', 'Authorization': token } }
    if (valores !== null) opcoes.body = JSON.stringify(valores)
    return fetch(url, opcoes).then(async res => {
        const dados = await res.json().catch(() => ({}))
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token'); localStorage.removeItem('nomeFuncionario')
            alert('Sessão inválida ou expirada. Faça login novamente.')
            location.href = '../html/login.html'
            throw new Error('Sessão expirada')
        }
        if (!res.ok) throw new Error(dados.message || 'Não foi possível concluir a operação.')
        return dados
    })
}


const tabela = document.getElementById('tabela')
document.getElementById('btn_listar').addEventListener('click', carregar)
async function carregar() {
    try {
        const d = await requisicao('http://localhost:3000/entrega')
        const lista = Array.isArray(d) ? d : []
        const inicio = document.getElementById('data_inicio').value, fim = document.getElementById('data_fim').value
        const filtradas = lista.filter(e => {
            const dataEntrega = String(e.data || '').slice(0,10)
            return (!inicio || dataEntrega >= inicio) && (!fim || dataEntrega <= fim)
        }).sort((a,b) => new Date(String(a.data).slice(0,10) + 'T' + (a.hora || '00:00')) - new Date(String(b.data).slice(0,10) + 'T' + (b.hora || '00:00')))
        if (!filtradas.length) { tabela.textContent = 'Nenhuma entrega encontrada para esse período.'; return }
        let html = '<table><thead><tr><th>Código</th><th>Cidade destino</th><th>Status</th><th>Data</th><th>Hora</th><th>Código da carga</th></tr></thead><tbody>'
        filtradas.forEach(e => { html += `<tr><td>${escapar(e.codEntrega ?? e.idEntrega ?? e.id)}</td><td>${escapar(e.cidadeDestino)}</td><td><span class="badge">${escapar(e.status)}</span></td><td>${escapar(String(e.data || '').slice(0,10))}</td><td>${escapar(e.hora)}</td><td>${escapar(e.idCarga ?? e.codCarga)}</td></tr>` })
        tabela.innerHTML = html + '</tbody></table>'
    } catch(err) { tabela.textContent = err.message }
}
