const prisma = require("../data/prisma");

const cadastrar = async (data) => {

    const produto = await prisma.produto.findUnique({
        where: {
            id: Number(data.produtoId)
        }
    });

    if (!produto) {
        throw new Error("Produto não encontrado.");
    }

    const quantidade = Number(data.quantidade);

    if (quantidade <= 0) {
        throw new Error("A quantidade deve ser maior que zero.");
    }

    let novoEstoque = produto.estoque;

    if (data.status === "PEDIDO") {
        novoEstoque -= quantidade;
    }

    else if (data.status === "PRODUZIDO") {

        if (quantidade > produto.estoque) {
            throw new Error("Estoque insuficiente.");
        }

        novoEstoque += quantidade;
    }

    const movimentacao = await prisma.$transaction(async (tx) => {

        const novaMovimentacao =
            await tx.movimentacao.create({
                data: {
                    produtoId: Number(data.produtoId),
                    quantidade: quantidade,
                    date: new Date(data.date),
                    status: data.status
                }
            });

        await tx.produto.update({
            where: {
                id: Number(data.produtoId)
            },
            data: {
                estoque: novoEstoque
            }
        });

        return novaMovimentacao;
    });

    return movimentacao;
};


const listar = async () => {

    const movimentacoes =
        await prisma.movimentacao.findMany({
            include: {
                produto: true
            }
        });

    return movimentacoes;
};


module.exports = {
    cadastrar,
    listar
};