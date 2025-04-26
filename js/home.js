function configurar() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    if (usuario) {
        document.getElementById("login").textContent = usuario.login || "Desconhecido";
        carregarProdutos(usuario.chave);
    }

    const alertas = JSON.parse(localStorage.getItem("alertasPreco")) || [];
    alertas.forEach(adicionarNaTabela);

    setInterval(verificarAlertasDePreco, 30000);
}

async function carregarProdutos(chave) {
    const select = document.getElementById("produtoSelect");

    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${chave}/usuario`);
        const produtos = await resposta.json();

        select.innerHTML = '<option selected disabled>Selecione um produto</option>';

        produtos.forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.textContent = produto.descricao + ' - R$' + produto.valor.toFixed(2);
            select.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        select.innerHTML = '<option disabled>Erro ao carregar</option>';
    }
}

function adicionarNaTabela(alerta) {
    const tabela = document.querySelector("#tabela tbody");
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${alerta.descricao}</td>
        <td>R$ ${alerta.valorAlerta.toFixed(2)}</td>
        <td>${alerta.acao === "comprar" ? "Compra Automática" : "Exibir Alerta"}</td>
    `;

    tabela.appendChild(tr);
}


function apagarLinhas(tabela) {
    // Seleciona o corpo da tabela 
    var corpoTabela = tabela.querySelector("tbody");

    // Enquanto houver linhas no corpo da tabela, remove a primeira
    while (corpoTabela.rows.length > 0) {
        corpoTabela.deleteRow(0);
    }
}

function cadastrar() {
    const produtoSelect = document.getElementById("produtoSelect");
    const produtoSelecionado = produtoSelect.options[produtoSelect.selectedIndex];
    const descricao = produtoSelecionado.text;
    const chaveProduto = produtoSelecionado.value;
    const valorAlerta = parseFloat(document.getElementById("valorAlerta").value);
    const acao = document.getElementById("acaoAlerta").value;

    if (!chaveProduto || isNaN(valorAlerta)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const alerta = {
        chaveProduto,
        descricao,
        valorAlerta,
        acao
    };

    let alertas = JSON.parse(localStorage.getItem("alertasPreco")) || [];
    alertas.push(alerta);
    localStorage.setItem("alertasPreco", JSON.stringify(alertas));

    adicionarNaTabela(alerta);
}

async function verificarAlertasDePreco() {
    const alertas = JSON.parse(localStorage.getItem("alertasPreco")) || [];

    for (const alerta of alertas) {
        try {
            const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.chaveProduto}`);
            const produto = await resposta.json();

            if (produto && produto.valor <= alerta.valorAlerta) {
                if (alerta.acao === "alerta") {
                    alert(`O produto "${alerta.descricao}" atingiu o valor desejado!`);
                } else if (alerta.acao === "comprar") {
                    console.log(`Simulando compra do produto "${alerta.descricao}"...`);
                }
            }

        } catch (erro) {
            console.error("Erro ao verificar preço:", erro);
        }
    }
}