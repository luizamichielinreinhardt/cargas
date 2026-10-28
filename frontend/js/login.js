
const form = document.getElementById('form_login')
const resposta = document.getElementById('resposta')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const valores = { email: document.getElementById('email').value.trim(), senha: document.getElementById('senha').value }
    try {
        const res = await fetch('http://localhost:3000/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(valores) })
        const dados = await res.json().catch(() => ({}))
        if (!res.ok || !dados.token) throw new Error(dados.message || 'E-mail ou senha inválidos.')
        localStorage.setItem('token', dados.token)
        localStorage.setItem('nomeFuncionario', dados.nome || dados.nomeFuncionario || valores.email)
        location.href = '../index.html'
    } catch (err) { resposta.textContent = err.message || 'Erro ao conectar com o servidor.' }
})

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
