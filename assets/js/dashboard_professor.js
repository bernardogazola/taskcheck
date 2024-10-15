document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        toggleSidebarButton: document.getElementById("toggleSidebar"),
        sidebar: document.getElementById("sidebar"),
        content: document.getElementById("content"),
        viewReportsButton: document.getElementById("view-reports-card"),
        sentReportsCard: document.getElementById("sent-reports-card"),
        tabelaBody: document.querySelector("#sent-reports-card .table tbody"),
        logoutButton: document.getElementById("logout-btn")
    }

    init();

    function init() {
        // CONFIGURAÇÃO DOS BOTÕES PRINCIPAIS
        elements.toggleSidebarButton.addEventListener("click", toggleSidebar);
        elements.viewReportsButton.addEventListener("click", mostrarCardRelatorios);

        // LOGOUT
        elements.logoutButton.addEventListener("click", logout);
    }

    // MOSTRAR/ESCONDER SIDEBAR
    function toggleSidebar() {
        elements.sidebar.classList.toggle("hidden");
        elements.content.classList.toggle("sidebar-hidden");
    }

    function mostrarCardRelatorios(event) {
        event.preventDefault();
        document.getElementById('sent-reports-card').style.display = 'block';
        //document.getElementById('add-category-form').style.display = 'none';
        //carregarCategorias();
        carregarRelatoriosSubmetidos();
    }

    // Inicializa a função para carregar relatórios ao abrir o card
    async function carregarRelatoriosSubmetidos() {
        try {
            const response = await fetch("../api/reportApi.php?action=list_by_professor");
            const relatorios = await response.json();
            exibirRelatoriosSubmetidos(relatorios);
        } catch (error) {
            console.error("Erro ao carregar relatórios:", error);
        }
    }

    // Exibir os relatórios na tabela
    function exibirRelatoriosSubmetidos(relatorios) {
        elements.tabelaBody.innerHTML = "";

        if (relatorios.status === "error") {
            elements.tabelaBody.innerHTML = `<tr><td colspan="8">${relatorios.message}</td></tr>`;
            return;
        }

        relatorios.forEach((relatorio) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${relatorio.atividade}</td>
                <td>${relatorio.curso}</td>
                <td>${relatorio.categoria}</td>
                <td>${relatorio.aluno}</td>
                <td>${relatorio.data_realizacao}</td>
                <td>${relatorio.status}</td>
            `;

            const colunaCertificado = document.createElement("td");
            const btnCertificado = criarBotao("Certificado", "btn-secondary", () => visualizarCertificado(relatorio.id));
            colunaCertificado.appendChild(btnCertificado);
            linha.appendChild(colunaCertificado);

            const colunaAcoes = document.createElement("td");
            const divAcoes = document.createElement("div");
            divAcoes.classList.add("d-flex");

            const btnDetalhes = criarBotao("Detalhes", "btn-info", () => visualizarFeedback(relatorio.id));
            divAcoes.appendChild(btnDetalhes);

            colunaAcoes.appendChild(divAcoes);
            linha.appendChild(colunaAcoes);
            elements.tabelaBody.appendChild(linha);
        });
    }

    // Função para criar botões reutilizáveis
    function criarBotao(texto, classe, onClick) {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-sm", classe, "me-2");
        button.textContent = texto;
        button.addEventListener("click", onClick);
        return button;
    }

    // Visualizar o certificado
    async function visualizarCertificado(idRelatorio) {
        try {
            const response = await fetch(`../api/reportApi.php?action=get_certificate&id_relatorio=${idRelatorio}`);
            const data = await response.json();

            if (data.status === "success") {
                const blob = new Blob([data.certificado], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                window.open(url);
            } else {
                alert(data.message || "Erro ao carregar certificado");
            }
        } catch (error) {
            console.error("Erro ao carregar o certificado:", error);
        }
    }

    // Visualizar feedback
    async function visualizarFeedback(idRelatorio) {
        try {
            const response = await fetch(`../api/reportApi.php?action=feedback&id_relatorio=${idRelatorio}`);
            const feedback = await response.json();

            if (feedback.status !== "error") {
                alert(`Feedback: ${feedback.texto_feedback}`);
            } else {
                console.error(feedback.message);
            }
        } catch (error) {
            console.error("Erro ao carregar o feedback:", error);
        }
    }

    // LOGOUT
    function logout(event) {
        event.preventDefault();
        window.location.href = "../api/logout.php";
    }
})