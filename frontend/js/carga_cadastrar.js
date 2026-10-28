
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


document.getElementById('form_carga').addEventListener('submit', async (e) => {
    e.preventDefault()
    const valores = { descricao: descricao.value.trim(), peso: Number(peso.value), volume: Number(volume.value), codigoRastreio: Number(codigoRastreio.value), idMotorista: Number(idMotorista.value) }
    try { const d = await requisicao('http://localhost:3000/carga','POST',valores); mostrarMensagem(d.message || 'Carga cadastrada com sucesso.'); e.target.reset() }
    catch(err) { mostrarMensagem(err.message) }
})
