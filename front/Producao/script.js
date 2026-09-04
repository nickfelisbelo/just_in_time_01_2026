const API = "http://localhost:3000/";

const produtoSelect = document.getElementById("produto");
const form = document.getElementById("formMovimentacao");
const tabelaMovimentacoes = document.getElementById("tabelaMovimentacoes");

let produtos = [];

async function carregarProdutos() {
    try {
        const resposta = await fetch(`${API}produto/listar`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos.");
        }

        produtos = await resposta.json();

        produtos.sort((a, b) => a.nome.localeCompare(b.nome));

        produtoSelect.innerHTML =
            '<option value="">Selecione um produto</option>';

        produtos.forEach(produto => {
            const option = document.createElement("option");

            option.value = produto.id;
            option.textContent =
                `${produto.nome} - Estoque: ${produto.estoque}`;

            produtoSelect.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar os produtos.");
    }
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const produtoId =
            Number(produtoSelect.value);

        const status =
            document.getElementById("status").value;

        const quantidade =
            Number(document.getElementById("quantidade").value);

        const data =
            document.getElementById("data").value;

        if (!produtoId) {
            alert("Selecione um produto.");
            return;
        }

        if (!status) {
            alert("Selecione o status.");
            return;
        }

        if (quantidade <= 0) {
            alert("A quantidade deve ser maior que zero.");
            return;
        }

        if (!data) {
            alert("Informe a data.");
            return;
        }

        const movimentacao = {
            produtoId: produtoId,
            quantidade: quantidade,
            date: `${data}T00:00:00`,
            status: status
        };

        const resposta = await fetch(
            `${API}movimentacao/cadastrar`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movimentacao)
            }
        );

        let resultado;

        try {
            resultado = await resposta.json();
        } catch {
            resultado = {
                mensagem: "Erro inesperado no servidor."
            };
        }

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem ||
                "Erro ao cadastrar movimentação."
            );
        }

        alert("Movimentação cadastrada com sucesso!");

        form.reset();

        await carregarProdutos();
        await carregarMovimentacoes();
        await verificarEstoque();

    } catch (erro) {
        console.error(erro);
        alert(erro.message);
    }
});

async function carregarMovimentacoes() {
    try {
        const resposta =
            await fetch(`${API}movimentacao/listar`);

        let resultado;

        try {
            resultado = await resposta.json();
        } catch {
            resultado = {
                mensagem: "Erro inesperado no servidor."
            };
        }

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem ||
                "Erro ao buscar movimentações."
            );
        }

        resultado.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        tabelaMovimentacoes.innerHTML = "";

        resultado.forEach(movimentacao => {
            const tr = document.createElement("tr");

            const nomeProduto =
                movimentacao.produto
                    ? movimentacao.produto.nome
                    : "Produto não encontrado";

            const data =
                new Date(movimentacao.date)
                    .toLocaleDateString("pt-BR");

            let statusTexto;

            if (movimentacao.status === "PEDIDO") {
                statusTexto = "Pedido";
            } else if (movimentacao.status === "PRODUZIDO") {
                statusTexto = "Produzido";
            } else {
                statusTexto = movimentacao.status;
            }

            tr.innerHTML = `
                <td>${nomeProduto}</td>
                <td>${statusTexto}</td>
                <td>${movimentacao.quantidade}</td>
                <td>${data}</td>
            `;

            tabelaMovimentacoes.appendChild(tr);
        });

    } catch (erro) {
        console.error(erro);

        tabelaMovimentacoes.innerHTML = `
            <tr>
                <td colspan="4">
                    Erro ao carregar movimentações.
                </td>
            </tr>
        `;
    }
}

async function verificarEstoque() {
    try {
        const resposta =
            await fetch(`${API}produto/listar`);

        if (!resposta.ok) {
            throw new Error("Erro ao verificar estoque.");
        }

        const produtosEstoque =
            await resposta.json();

        const produtosBaixos =
            produtosEstoque.filter(
                produto => produto.estoque < 3
            );

        if (produtosBaixos.length > 0) {
            let mensagem =
                "Atenção! Produtos com estoque baixo:\n\n";

            produtosBaixos.forEach(produto => {
                mensagem +=
                    `${produto.nome}: ${produto.estoque} unidade(s)\n`;
            });

            alert(mensagem);
        }

    } catch (erro) {
        console.error(erro);
    }
}

function filtrarProdutos() {
    const campoBusca =
        document.getElementById("buscarProduto");

    if (!campoBusca) {
        return;
    }

    const texto =
        campoBusca.value.toUpperCase();

    const opcoes =
        produtoSelect.querySelectorAll("option");

    opcoes.forEach(option => {
        if (option.value === "") {
            return;
        }

        const nome =
            option.textContent.toUpperCase();

        if (nome.includes(texto)) {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    });
}

function principal() {
    window.location.href =
        "../Home/index.html";
}

function sair() {
    localStorage.clear();

    window.location.href =
        "../index.html";
}

async function iniciar() {
    await carregarProdutos();
    await carregarMovimentacoes();
    await verificarEstoque();
}

iniciar();