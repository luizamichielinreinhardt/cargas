
const verificar_log = document.getElementById('verificar_log')
const token = localStorage.getItem('token')
const nome = localStorage.getItem('nomeFuncionario')
if (token) {
    verificar_log.innerHTML = `<a href="#" id="btn_logout">Logout</a> &emsp;<span class="titulo_menu">${nome || 'Funcionário autenticado'}</span>`
    document.getElementById('btn_logout').addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('nomeFuncionario')
        location.reload()
    })
} else {
    verificar_log.innerHTML = `<a href="./html/login.html">Login</a>`
}
