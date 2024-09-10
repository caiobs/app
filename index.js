const start = () => {
    while(true) {
        let opcao = "sair";
        switch(opcao) {
            case "cadastrar":
                console.log("Vamos cadastrar.");
            case "listar":
                console.log("Vamos listar.");
            case "sair":
                return;
        };
    };
};

start();