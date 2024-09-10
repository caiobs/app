const { select } = require('@inquirer/prompts');

const start = async () => {
    while(true) {

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
                    name: "Sair",
                    value: "sair"
                }
            ]
        });

        switch(opcao) {
            case "cadastrar":
                console.log("Vamos cadastrar.");
                break;
            case "listar":
                console.log("Vamos listar.");
                break;
            case "sair":
                return;
        };
    };
};

start();