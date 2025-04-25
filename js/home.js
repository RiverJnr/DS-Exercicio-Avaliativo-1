function configurar() {
    if (!localStorage.usuarioAutenticado) {
        alert('Acesso negado');
        window.location.href = "login.html";
    } else {
        let usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
        document.getElementById("login").textContent = usuarioAutenticado.login;
    }

    exibirTabela();
}


function exibirTabela() {

    var tabela = document.getElementById("tabela");
    apagarLinhas(tabela);

    //recupera o vetor na memória secundária
    var vagas = JSON.parse(localStorage.getItem('vagas'));

    vagas.forEach(vaga => {
        adicionarLinha(tabela, vaga)
    });
}

function adicionarLinha(tabela, vaga) {
    // Seleciona o corpo da tabela 
    var tbody = tabela.querySelector("tbody");

    // Cria uma nova linha
    var novaLinha = document.createElement("tr");

    // Cria e adiciona na nova linha as células com os valores
    var colunaNumero = document.createElement("td");
    colunaNumero.textContent = vaga.numero;
    novaLinha.appendChild(colunaNumero);

    var colunaPlaca = document.createElement("td");
    colunaPlaca.textContent = vaga.placa;
    novaLinha.appendChild(colunaPlaca);

    var colunaLogin = document.createElement("td");
    colunaLogin.textContent = vaga.login;
    novaLinha.appendChild(colunaLogin);

    // Adiciona a nova linha ao tbody
    tbody.appendChild(novaLinha);
}

function apagarLinhas(tabela) {
    // Seleciona o corpo da tabela 
    var corpoTabela = tabela.querySelector("tbody");

    // Enquanto houver linhas no corpo da tabela, remove a primeira
    while (corpoTabela.rows.length > 0) {
        corpoTabela.deleteRow(0);
    }
}


function registrar() {
    //recupera o vetor de registros na memória secundária
    let vagas = JSON.parse(localStorage.getItem('vagas'));

    let placa = document.getElementById("placa").value;
    let vaga = document.getElementById("vaga").value;

    let usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));

    if (vagas.some(p => p.placa == placa)) {
        alert('A placa informada já foi registrada');
    } else {
        if (vagas[vaga].placa.length > 0) {
            alert('A vaga selecionada está indisponível');
        } else {

            vagas[vaga].placa = placa;
            vagas[vaga].login = usuarioAutenticado.login;

            //armazena o vetor na memória secundária
            localStorage.setItem('vagas', JSON.stringify(vagas));

            alert('Registro realizado com sucesso');

            exibirTabela();

        }
    }
}
