const movimentacaoService =
    require("../services/movimentacao.services");


const cadastrar = async (req, res) => {

    try {

        const data = req.body;

        const movimentacao =
            await movimentacaoService.cadastrar(data);

        res.status(201).json(movimentacao);

    } catch (erro) {

        console.error(erro);

        res.status(400).json({
            mensagem: erro.message
        });
    }
};


const listar = async (req, res) => {

    try {

        const movimentacoes =
            await movimentacaoService.listar();

        res.status(200).json(movimentacoes);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar movimentações."
        });
    }
};


module.exports = {
    cadastrar,
    listar
};