const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises;

let mensagem = "";
let metas;

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados);
    }
    catch(erro) { metas = [] };
};

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: " });

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia';
        return;
    }

    metas.push(
        { value: meta, checked: false }
    );

    mensagem = 'Meta cadastrada com sucesso!';
};

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!";
        return;
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar esta etapa.",
        choices: [...metas],
        instructions: false
    });

    metas.forEach((m) => {
        m.checked = false;
    });

    if(respostas.length == 0) {
        mensagem = 'Nenhuma meta selecionada.'
        return;
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta;
        });

        meta.checked = true;
    });

    mensagem = 'Meta(s) marcada(s) como concluída(s)';
};

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked;
    });

    if(realizadas.length == 0) {
        mensagem = "Não existem metas realizadas!";
        return;
    }

    await select({
        message: `${realizadas.length} meta(s) realizada(s)`,
        choices: [...realizadas]
    });
};

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return !meta.checked;
    });

    if(abertas.length == 0) {
        mensagem = "Não existem metas abertas!";
        return;
    };

    await select({
        message: `${abertas.length} meta(s) aberta(s)`,
        choices: [...abertas]
    });
};

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!";
        return;
    };

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false };
    });

    const itensDeletar = await checkbox({
        message: "Selecione o item para remover",
        choices: [...metasDesmarcadas],
        instruction: false,
    });

    if(itensDeletar.length == 0) {
        mensagem = "Nenhum item para deletar!";
        return;
    };

    itensDeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item;
        });
    });

    mensagem = "Meta(s) deletada(s) com sucesso!";
};

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
};

const start = async () => {
    await carregarMetas();

    while(true) {
        mostrarMensagem();
        await salvarMetas();

        let opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar meta(s)",
                    value: "listar"
                },
                {
                    name: "Meta(s) realizada(s)",
                    value: "realizadas"
                },
                {
                    name: "Meta(s) aberta(s)",
                    value: "abertas"
                },
                {
                    name: "Deletar meta(s)",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        });

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta();
                break;
            case "listar":
                await listarMetas();
                break;
            case "realizadas":
                await metasRealizadas();
                break;
            case "abertas":
                await metasAbertas();
                break;
            case "deletar":
                await deletarMetas();
                break;
            case "sair":
                console.log("Até a próxima!");
                return;
        };
    };
};

start();