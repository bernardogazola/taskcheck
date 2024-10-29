document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        toggleSidebarButton: document.getElementById("toggleSidebar"),
        sidebar: document.getElementById("sidebar"),
        content: document.getElementById("content"),
        viewReportsButton: document.getElementById("view-reports-card"),
        sentReportsCard: document.getElementById("sent-reports-card"),
        tabelaBody: document.querySelector("#sent-reports-card .table tbody"),
        filtrarAtividadesDropdown: document.getElementById("filtrarAtividades"),
        avisoAltaDemanda: document.getElementById("avisoAltaDemanda"),
        logoutButton: document.getElementById("logout-btn")
    }

    init();

    function init() {
        // CONFIGURAÇÃO DOS BOTÕES PRINCIPAIS
        elements.toggleSidebarButton.addEventListener("click", toggleSidebar);
        elements.viewReportsButton.addEventListener("click", mostrarCardRelatorios);

        // FILTRAR RELATORIOS POR CATEGORIA PELO DROPDOWN
        elements.filtrarAtividadesDropdown.addEventListener("change", filtrarRelatoriosPorCategoria);

        // LOGOUT
        elements.logoutButton.addEventListener("click", logout);
    }

    // MOSTRAR/ESCONDER SIDEBAR
    function toggleSidebar() {
        elements.sidebar.classList.toggle("hidden");
        elements.content.classList.toggle("sidebar-hidden");
    }

    async function mostrarCardRelatorios(event) {
        event.preventDefault();
        document.getElementById('sent-reports-card').style.display = 'block';
        await verificarAltaDemanda();
        carregarRelatoriosSubmetidos();
        carregarCategorias();
    }

    // ALTA DEMANDA
    async function verificarAltaDemanda() {
        try {
            const response = await fetch("../api/reportApi.php?action=verificar_alta_demanda");
            const data = await response.json();
            if (data.status === "success" && data.quantidadePendentes > 50) {
                elements.avisoAltaDemanda.style.display = "block";
            } else {
                elements.avisoAltaDemanda.style.display = "none";
            }
        } catch (error) {
            console.error("Erro ao verificar alta demanda:", error);
        }
    }

    // CARREGAR RELATÓRIOS
    async function carregarRelatoriosSubmetidos() {
        try {
            const response = await fetch("../api/reportApi.php?action=list_by_professor");
            const relatorios = await response.json();
            exibirRelatoriosSubmetidos(relatorios);
        } catch (error) {
            console.error("Erro ao carregar relatórios:", error);
        }
    }

    // FILTRAR RELATORIOS POR CATEGORIA
    async function filtrarRelatoriosPorCategoria() {
        const categoriaId = elements.filtrarAtividadesDropdown.value;

        try {
            const response = await fetch(`../api/reportApi.php?action=list_by_professor&categoria=${categoriaId}`);
            const relatoriosFiltrados = await response.json();
            exibirRelatoriosSubmetidos(relatoriosFiltrados);
        } catch (error) {
            console.error("Erro ao filtrar relatórios:", error);
        }
    }

    // EXIBIR RELATÓRIOS
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

    async function carregarCategorias() {
        try {
            const response = await fetch("../api/categoryApi.php?action=list");
            const categorias = await response.json();

            if (categorias && categorias.length) {
                elements.filtrarAtividadesDropdown.innerHTML = `<option value="" selected>Filtrar</option>`;
                categorias.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id;
                    option.textContent = categoria.nome;
                    elements.filtrarAtividadesDropdown.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    }

    // CRIAR BOTÕES
    function criarBotao(texto, classe, onClick) {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-sm", classe, "me-2");
        button.textContent = texto;
        button.addEventListener("click", onClick);
        return button;
    }

    // VISUALIZAR CERT EM PDF
    async function visualizarCertificado(idRelatorio) {
        window.open(`../api/reportApi.php?action=get_certificate&id_relatorio=${idRelatorio}`, '_blank');
    }

    // VISUALIZAR FEEDBACK -- EM DESENVOLVIMENTE - NÃO FINALIZADO
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
