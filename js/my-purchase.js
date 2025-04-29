function configurar() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    if (usuario) {
        document.getElementById("login").textContent = usuario.nome || "Desconhecido";
    }

    exibeTabela();
}

function exibeTabela() {
    const compras = JSON.parse(localStorage.getItem("comprasRealizadas")) || [];
    const tabela = document.getElementById("tabelaCompras");

    if (compras.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");
        celula.colSpan = 3;
        celula.textContent = "Nenhuma compra realizada ainda.";
        celula.classList.add("text-center");
        linha.appendChild(celula);
        tabela.appendChild(linha);
        return;
    }

    compras.forEach(compra => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
                <td>${compra.descricao}</td>
                <td>R$ ${compra.valor.toFixed(2)}</td>
            `;
        tabela.appendChild(linha);
    });
}