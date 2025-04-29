function configurar() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    if (usuario) {
        document.getElementById("login").textContent = usuario.nome || "Desconhecido";
        carregarProdutos(usuario.chave);
    }

    atualizarTabela();

    $('#valorAlerta').mask('R$ 000.000.000,00', {
        reverse: true,
        selectOnFocus: true
    });

    $('#valorAlerta').on('focus', function () {
        if (!this.value.includes('R$')) {
            $(this).val('R$ ');
        }

        setTimeout(() => {
            this.setSelectionRange(this.value.length, this.value.length);
        }, 10);
    });

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

function adicionarNaTabela(alerta, indice) {
    const tabela = document.querySelector("#tabela tbody");
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${alerta.descricao}</td>
        <td>R$ ${alerta.valorAlerta.toFixed(2)}</td>
        <td>${alerta.acao === "comprar" ? "Compra Automática" : "Exibir Alerta"}</td>
        <td>
            <button class="btn btn-danger btn-sm ms-2" onclick="excluirAlerta(${indice})">Excluir</button>
        </td>
    `;

    tabela.appendChild(tr);
}

function cadastrar() {
    const produtoSelect = document.getElementById("produtoSelect");
    const produtoSelecionado = produtoSelect.options[produtoSelect.selectedIndex];

    if (!produtoSelecionado || produtoSelecionado.disabled) {
        alert("Selecione um produto válido.");
        return;
    }

    const descricao = produtoSelecionado.text;
    const chaveProduto = produtoSelecionado.value;
    let valorAlerta = $('#valorAlerta').cleanVal();
    valorAlerta = parseFloat(valorAlerta) / 100;

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

    adicionarNaTabela(alerta, alertas.length - 1);
}

function excluirAlerta(indice) {
    let alertas = JSON.parse(localStorage.getItem("alertasPreco")) || [];
    
    if (indice > -1) {
        alertas.splice(indice, 1);
        localStorage.setItem("alertasPreco", JSON.stringify(alertas));
        atualizarTabela();
    }
}

function atualizarTabela() {
    const tabela = document.querySelector("#tabela tbody");
    tabela.innerHTML = "";

    const alertas = JSON.parse(localStorage.getItem("alertasPreco")) || [];
    alertas.forEach((alerta, index) => {
        adicionarNaTabela(alerta, index);
    });
}

async function verificarAlertasDePreco() {
    const alertas = JSON.parse(localStorage.getItem("alertasPreco")) || [];
    const compras = JSON.parse(localStorage.getItem("comprasRealizadas")) || [];

    const novosAlertas = [];

    for (const alerta of alertas) {
        try {
            const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.chaveProduto}`);
            const produto = await resposta.json();

            if (produto && produto.valor <= alerta.valorAlerta) {
                if (alerta.acao === "alerta") {
                    alert(`O produto "${produto.descricao}" atingiu o valor desejado!`);
                    novosAlertas.push(alerta);
                } else if (alerta.acao === "comprar") {
                    console.log(`Simulando compra do produto "${produto.descricao}"...`);

                    compras.push({
                        id: produto.id,
                        descricao: produto.descricao,
                        valor: produto.valor,
                        urlImagem: produto.urlImagem
                    });
                }
            } else {
                novosAlertas.push(alerta);
            }
        } catch (erro) {
            console.error("Erro ao verificar preço:", erro);
            novosAlertas.push(alerta);
        }
    }

    localStorage.setItem("alertasPreco", JSON.stringify(novosAlertas));
    localStorage.setItem("comprasRealizadas", JSON.stringify(compras));
}