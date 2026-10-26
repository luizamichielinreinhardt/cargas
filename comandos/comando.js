const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA)


const bytes1 = CryptoJS.AES.decrypt(motorista.CNH, CHAVE_SECRETA)

const CNHDescriptografada = bytes1.toString(CryptoJS.enc.Utf8)