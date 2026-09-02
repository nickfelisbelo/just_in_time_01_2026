async function login() {

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Preencha o email e a senha.');
        return;
    }

    try {

        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {

            // Guarda os dados do usuário que fez login
            localStorage.setItem('usuarioId', dados.usuario.id);
            localStorage.setItem('usuarioNome', dados.usuario.nome);
            localStorage.setItem('usuarioEmail', dados.usuario.email);

            alert('Login realizado com sucesso!');

            // Vai para a página principal
            window.location.href = '../Home/index.html';

        } else {

            alert(dados.mensagem);

        }

    } catch (erro) {

        console.error(erro);
        alert('Não foi possível conectar ao servidor.');

    }
}