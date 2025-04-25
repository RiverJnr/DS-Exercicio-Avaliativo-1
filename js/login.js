function configurar() {
    if (localStorage.usuarioAutenticado) {
        localStorage.removeItem("usuarioAutenticado")
    }
}

async function autenticar() {
    const login = document.getElementById("loginAutenticar").value;
    const senha = document.getElementById("senhaAutenticar").value;

    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`);
        const usuarioAutenticado = await resposta.json();

        if (!usuarioAutenticado || !usuarioAutenticado.login) {
            throw new Error("Falha na autenticação");
        }

        localStorage.setItem("usuarioAutenticado", JSON.stringify(usuarioAutenticado));
        window.location.href = "home.html";
    } catch (erro) {
        console.error("Erro ao autenticar:", erro);
        alert("Login ou senha incorretos.");
        window.location.href = "login.html";
    }
}