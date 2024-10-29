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
        detalhesModal: new bootstrap.Modal(document.getElementById("detalhesModal")),
        btnCertificado: document.getElementById("btnCertificado"),
        btnValidar: document.getElementById("btnValidar"),
        btnInvalidar: document.getElementById("btnInvalidar"),
        btnReverter: document.getElementById("btnReverter"),
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
                <td>${relatorio.status}</td>
            `;

            const colunaAcoes = document.createElement("td");
            const divAcoes = document.createElement("div");
            divAcoes.classList.add("d-flex");

            const btnDetalhes = criarBotao("Detalhes", "btn-primary", () => mostrarDetalhes(relatorio.id));
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

    // VISUALIZAR FEEDBACK -- EM DESENVOLVIMENTO - NÃO FINALIZADO
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

    async function obterCategoria(categoriaId) {
        try {
            const response = await fetch(`../api/categoryApi.php?action=get&id=${categoriaId}`);
            const categoria = await response.json();

            return categoria.nome;
        } catch (error) {
            console.error("Erro ao obter categoria:", error);
        }
    }

    // MODAL COM DETALHES
    async function mostrarDetalhes(relatorioId) {
        try {
            const response = await fetch(`../api/reportApi.php?action=get_activity&id_relatorio=${relatorioId}`);
            const relatorio = await response.json();

            if (relatorio.status !== "error") {
                document.getElementById("detalheDataRealizacao").textContent = relatorio.data_realizacao;
                document.getElementById("detalheDataEnvio").textContent = relatorio.data_envio;
                document.getElementById("detalheCategoria").textContent = await obterCategoria(relatorio.id_categoria);
                document.getElementById("detalheNome").textContent = relatorio.nome;
                document.getElementById("detalheReflexao").textContent = relatorio.texto_reflexao;

                elements.btnCertificado.onclick = () => visualizarCertificado(relatorioId);
                elements.btnValidar.onclick = () => validarRelatorio(relatorioId);
                elements.btnInvalidar.onclick = () => abrirCampoFeedback(relatorioId);
                elements.btnReverter.onclick = () => abrirCampoReversao(relatorioId);

                if (relatorio.status === "Aguardando validacao") {
                    elements.btnValidar.style.display = "inline";
                    elements.btnInvalidar.style.display = "inline";
                    elements.btnReverter.style.display = "none";
                } else {
                    elements.btnValidar.style.display = "none";
                    elements.btnInvalidar.style.display = "none";
                    elements.btnReverter.style.display = "inline";
                }

                elements.detalhesModal.show();

                // RESETAR MODAL AO FECHAR/ABRIR
                if (document.getElementById("detalhesModal").style.display === "none") {
                    document.getElementById("feedbackField").style.display = "none";
                    document.getElementById("reversaoField").style.display = "none";
                }
            } else {
                alert("Erro ao carregar detalhes do relatório.");
            }
        } catch (error) {
            console.error("Erro ao carregar os detalhes do relatório:", error);
        }
    }

    // CAMPO FEEDBACK
    function abrirCampoFeedback(relatorioId) {
        document.getElementById("feedbackField").style.display = "block";
        elements.btnInvalidar.onclick = () => invalidarRelatorio(relatorioId);
    }

    // INVALIDAR RELATORIO + FEEDBACK
    async function invalidarRelatorio(idRelatorio) {
        const feedbackText = document.getElementById("feedbackText").value;
        if (!feedbackText) {
            alert("Feedback é obrigatório para invalidar o relatório.");
            return;
        }

        const formData = new FormData();
        formData.append('id_relatorio', idRelatorio);
        formData.append('feedback', feedbackText);

        try {
            const response = await fetch(`../api/reportApi.php?action=invalidate`, { method: "POST", body: formData });
            const result = await response.json();
            if (result.status === "success") {
                alert("Relatório invalidado com sucesso!");
                elements.detalhesModal.hide();
                await carregarRelatoriosSubmetidos();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Erro ao invalidar o relatório:", error);
        }
    }

    // CAMPO JUSTIFICATIVA - REVERSÃO
    function abrirCampoReversao(relatorioId) {
        document.getElementById("reversaoField").style.display = "block";
        elements.btnReverter.onclick = () => reverterValidacao(relatorioId);
    }

    // REVERTER VALIDAÇÃO COM JUSTIFICATIVA
    async function reverterValidacao(idRelatorio) {
        const justificativaReversao = document.getElementById("justificativaReversao").value;
        if (!justificativaReversao) {
            alert("Justificativa é obrigatória para reverter a validação.");
            return;
        }

        const formData = new FormData();
        formData.append('id_relatorio', idRelatorio);
        formData.append('justificativa', justificativaReversao);

        try {
            const response = await fetch(`../api/reportApi.php?action=revert_validation`, { method: "POST", body: formData });
            const result = await response.json();
            if (result.status === "success") {
                alert("Validação revertida com sucesso!");
                elements.detalhesModal.hide();
                await carregarRelatoriosSubmetidos();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Erro ao reverter a validação:", error);
        }
    }

    // VALIDAR RELATÓRIO
    async function validarRelatorio(idRelatorio) {
        const formData = new FormData();
        formData.append('id_relatorio', idRelatorio);

        try {
            const response = await fetch(`../api/reportApi.php?action=validate&id_relatorio=${idRelatorio}`, { method: "POST", body: formData});
            const result = await response.json();
            if (result.status === "success") {
                alert("Relatório validado com sucesso!");
                elements.detalhesModal.hide();
                await carregarRelatoriosSubmetidos();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Erro ao validar o relatório:", error);
        }
    }

    // LOGOUT
    function logout(event) {
        event.preventDefault();
        window.location.href = "../api/logout.php";
    }
})
