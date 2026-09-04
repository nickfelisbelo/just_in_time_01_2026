const express = require("express");

const router = express.Router();

const { cadastrar, listar } = require("../controllers/movimentacao.controller");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);

module.exports = router;
