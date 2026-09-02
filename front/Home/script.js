const API = "http://localhost:3000/produto";

function abrirModal() {
    document.querySelector(".modal").style.display = "flex";
}

function fecharModal() {
    document.querySelector(".modal").style.display = "none";
}

function fecharModalAtualizar() {
    document.getElementById("modalAtualizar").style.display = "none";
}

function sair() {
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioNome");
    window.location.href = "../index.html";
}

async function cadastrar() {
    const nome = document.getElementById("nome").value.trim().toUpperCase();
    const descricao = document.getElementById("descricao").value.trim();
    const estoque = Number(document.getElementById("estoque").value);

    if (!nome || !descricao || isNaN(estoque) || estoque < 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    try {
        const resposta = await fetch(`${API}/cadastrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                descricao,
                estoque
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao cadastrar produto.");
            return;
        }

        alert("Produto cadastrado com sucesso!");

        document.getElementById("nome").value = "";
        document.getElementById("descricao").value = "";
        document.getElementById("estoque").value = "";

        fecharModal();
        listarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

async function listarProdutos() {
    try {
        const resposta = await fetch(`${API}/listar`);

        if (!resposta.ok) {
            alert("Erro ao listar produtos.");
            return;
        }

        const produtos = await resposta.json();
        const lista = document.getElementById("listaProdutos");

        if (produtos.length === 0) {
            lista.innerHTML = "<p>Nenhum produto cadastrado.</p>";
            return;
        }

        lista.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Estoque</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    ${produtos.map(produto => `
                        <tr>
                            <td>${produto.nome}</td>
                            <td>${produto.descricao}</td>
                            <td>${produto.estoque}</td>
                            <td>
                                <button onclick="atualizarProdutos(${produto.id})">
                                    Atualizar
                                </button>

                                <button onclick="excluirProdutos(${produto.id})">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

function filtrarProdutos() {
    const filtro = document
        .getElementById("busca")
        .value
        .trim()
        .toUpperCase();

    const linhas = document.querySelectorAll("#listaProdutos tbody tr");

    linhas.forEach(linha => {
        const nome = linha.children[0].textContent.toUpperCase();

        linha.style.display = nome.includes(filtro) ? "" : "none";
    });
}

async function atualizarProdutos(id) {
    try {
        const resposta = await fetch(`${API}/listar`);

        if (!resposta.ok) {
            alert("Erro ao buscar produto.");
            return;
        }

        const produtos = await resposta.json();
        const produto = produtos.find(produto => produto.id === id);

        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }

        document.getElementById("idAtualizar").value = produto.id;
        document.getElementById("nomeAtualizar").value = produto.nome;
        document.getElementById("descricaoAtualizar").value = produto.descricao;
        document.getElementById("estoqueAtualizar").value = produto.estoque;

        document.getElementById("modalAtualizar").style.display = "flex";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

async function salvarAtualizacao() {
    const id = document.getElementById("idAtualizar").value;
    const nome = document.getElementById("nomeAtualizar").value.trim().toUpperCase();
    const descricao = document.getElementById("descricaoAtualizar").value.trim();
    const estoque = Number(document.getElementById("estoqueAtualizar").value);

    if (!nome || !descricao || isNaN(estoque) || estoque < 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    try {
        const resposta = await fetch(`${API}/atualizar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                descricao,
                estoque
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao atualizar produto.");
            return;
        }

        alert("Produto atualizado com sucesso!");

        fecharModalAtualizar();
        listarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

async function excluirProdutos(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/excluir/${id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao excluir produto.");
            return;
        }

        alert("Produto excluído com sucesso!");

        listarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    listarProdutos();

    const nomeUsuario = localStorage.getItem("usuarioNome");

    if (nomeUsuario) {
        document.getElementById("bemVindo").textContent =
            `Bem-vindo, ${nomeUsuario}`;
    }
});