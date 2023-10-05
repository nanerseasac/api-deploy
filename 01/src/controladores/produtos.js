const knex = require("../conexao");

const listarProdutos = async (req, res) => {
	const { usuario } = req;
	const { categoria } = req.query;

	try {
		let condicao = "";
		const params = [];

		const query = await knex("produtos").where("usuario_id", usuario.id);

		if(query.length === 0) {
			return res.status(404).json({message: "usuario não há produtos cadastrado"})
		}

		if (categoria) {
				const getALlCategory = await knex('produtos').where('usuario_id', usuario.id)
				.andWhere('categoria','ilike',`%${categoria}%`)

			return res.status(200).json(getALlCategory)
		}

		return res.status(200).json(query);
	} catch (error) {
		console.log(error)
		return res.status(400).json(error.message);
	}
};

const obterProduto = async (req, res) => {
	const { usuario } = req;
	const { id } = req.params;

	try {
		const query = await knex("produtos")
			.where("usuario_id", usuario.id)
			.andWhere("id", id);

		if (query.length === 0) {
			return res.status(404).json("Produto não encontrado");
		}

		return res.status(200).json(query);
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

const cadastrarProduto = async (req, res) => {
	const { usuario } = req;
	const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

	if (!nome) {
		return res.status(404).json("O campo nome é obrigatório");
	}

	if (!estoque) {
		return res.status(404).json("O campo estoque é obrigatório");
	}

	if (!preco) {
		return res.status(404).json("O campo preco é obrigatório");
	}

	if (!descricao) {
		return res.status(404).json("O campo descricao é obrigatório");
	}

	try {
		const query = {
			usuario_id: usuario.id,
			nome: nome,
			estoque: estoque,
			preco: preco,
			categoria: categoria,
			descricao: descricao,
			imagem: imagem,
		};

		const produto = await knex("produtos").insert(query);

		if (!produto) {
			return res.status(400).json("O produto não foi cadastrado");
		}

		return res.status(200).json("O produto foi cadastrado com sucesso.");
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

const atualizarProduto = async (req, res) => {
	const { usuario } = req;
	const { id } = req.params;
	const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

	if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
		return res
			.status(404)
			.json("Informe ao menos um campo para atualizaçao do produto");
	}

	try {
		const produto = await knex("produtos")
			.where("usuario_id", usuario.id)
			.andWhere({ id });

		if (produto.length === 0) {
			return res.status(404).json("Produto não encontrado");
		}

		const body = {};
		const params = [];
		let n = 1;

		if (nome) {
			body.nome = nome;
			params.push(`nome = $${n}`);
			n++;
		}

		if (estoque) {
			body.estoque = estoque;
			params.push(`estoque = $${n}`);
			n++;
		}

		if (categoria) {
			body.categoria = categoria;
			params.push(`categoria = $${n}`);
			n++;
		}

		if (descricao) {
			body.descricao = descricao;
			params.push(`descricao = $${n}`);
			n++;
		}

		if (preco) {
			body.preco = preco;
			params.push(`preco = $${n}`);
			n++;
		}

		if (imagem) {
			body.imagem = imagem;
			params.push(`imagem = $${n}`);
			n++;
		}

		const queryAtualizacao = await knex("produtos")
			.update(body)
			.where({ id })
			.andWhere("usuario_id", usuario.id);

		const produtoAtualizado = queryAtualizacao;

		if (produtoAtualizado.length === 0) {
			return res.status(400).json("O produto não foi atualizado");
		}

		return res.status(200).json("produto foi atualizado com sucesso.");
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

const excluirProduto = async (req, res) => {
	const { usuario } = req;
	const { id } = req.params;

	try {
		const query = await knex("produtos")
			.where({ id })
			.andWhere("usuario_id", usuario.id);

		if (query.length === 0) {
			return res.status(404).json("Produto não encontrado");
		}

		const produtoExcluido = await knex("produtos")
			.del()
			.where({ id })
			.andWhere("usuario_id", usuario.id);

		if (produtoExcluido.length === 0) {
			return res.status(400).json("O produto não foi excluido");
		}

		return res.status(200).json("Produto excluido com sucesso");
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

module.exports = {
	listarProdutos,
	obterProduto,
	cadastrarProduto,
	atualizarProduto,
	excluirProduto,
};
