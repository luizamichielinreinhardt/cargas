
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
document.getElementById('btn_listar').addEventListener('click', () => carregar('http://localhost:3000/motorista'))
document.getElementById('btn_buscar').addEventListener('click', () => {
    const n = document.getElementById('nome_busca').value.trim()
    if (!n) { tabela.textContent = 'Digite um nome para buscar.'; return }
    carregar('http://localhost:3000/motorista/buscarNome/' + encodeURIComponent(n))
})
async function carregar(url) {
    try {
        const d = await requisicao(url)
        const lista = Array.isArray(d) ? d : (d && !d.message ? [d] : [])
        if (!lista.length) { tabela.textContent = 'Nenhum motorista encontrado.'; return }
        let html = '<table><thead><tr><th>Código</th><th>Nome</th><th>Telefone</th></tr></thead><tbody>'
        lista.forEach(m => { html += `<tr><td>${escapar(m.codMotorista ?? m.idMotorista ?? m.id)}</td><td>${escapar(m.nome)}</td><td>${escapar(m.telefone)}</td></tr>` })
        tabela.innerHTML = html + '</tbody></table>'
    } catch(err) { tabela.textContent = err.message }
}
