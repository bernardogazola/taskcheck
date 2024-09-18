document.addEventListener("DOMContentLoaded", function () {
    const toggleSidebarButton = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const addActivityButton = document.getElementById("add-activity");
    const viewSentActivitiesButton = document.getElementById("view-sent-activities");

    const activityForm = document.getElementById('activity-form');
    const sentActivitiesCard = document.getElementById('sent-activities-card');

    // BTN MOSTRAR/ESCONDER SIDEBAR
    toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        content.classList.toggle("sidebar-hidden");
    });

    // BTN ADICIONAR ATIVIDADE
    addActivityButton.addEventListener("click", (event) => {
        event.preventDefault();
        mostrarFormularioAtividade();
        carregarCategorias();
    });

    // BTN ATIVIDADES ENVIADAS
    viewSentActivitiesButton.addEventListener("click", (event) => {
        event.preventDefault();
        mostrarCardAtividadesEnviadas();
        carregarAtividadesEnviadas();
    });

    // MOSTRAR FORMULÁRIO - RELATÓRIO ATIVIDADE
    function mostrarFormularioAtividade() {
        activityForm.style.display = 'block';
        sentActivitiesCard.style.display = 'none';
    }

    // MOSTRAR ATIVIDADES ENVIADAS
    function mostrarCardAtividadesEnviadas() {
        activityForm.style.display = 'none';
        sentActivitiesCard.style.display = 'block';
    }

    // CARREGAR CATEGORIAS
    function carregarCategorias() {
        fetch("../api/categoryApi.php?action=list")
            .then((response) => response.json())
            .then((categorias) => {
                const categoriaDropdown = document.getElementById("categoria");
                categoriaDropdown.innerHTML = '<option selected>Selecionar categoria</option>';

                const categoriaEditDropdown = document.getElementById("edit-categoria");
                categoriaEditDropdown.innerHTML = '<option selected>Selecionar categoria</option>';

                categorias.forEach((categoria) => {
                    const option = document.createElement("option");
                    option.value = categoria.id;
                    option.text = categoria.nome;
                    categoriaDropdown.add(option.cloneNode(true));
                    categoriaEditDropdown.add(option);
                });
            })
            .catch((error) => console.error("Erro ao carregar categorias:", error));
    }

    // COLETAR + ENVIAR DADOS FORMULÁRIO - RELATÓRIO ATIVIDADE
    const addActivityForm = document.querySelector('#activity-form form');
    addActivityForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const data_realizacao = document.getElementById('data').value;
        const id_categoria = document.getElementById('categoria').value;
        const texto_reflexao = document.getElementById('reflexao').value;
        const certificado = document.getElementById('certificado').files[0];
        const messageContainer = document.getElementById('response-message');

        if (id_categoria === "Selecionar categoria") {
            messageContainer.innerHTML = `<p class="text-danger">Por favor, selecione uma categoria válida.</p>`;
            return;
        }

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('data_realizacao', data_realizacao);
        formData.append('id_categoria', id_categoria);
        formData.append('texto_reflexao', texto_reflexao);
        formData.append('certificado', certificado);

        fetch('../api/reportApi.php?action=add', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    messageContainer.innerHTML = `<p class="text-success">${result.message}</p>`;
                    addActivityForm.reset();
                } else {
                    messageContainer.innerHTML = `<p class="text-danger">${result.message}</p>`;
                }
            })
            .catch(error => {
                console.error('Erro ao enviar a atividade:', error);
            });
    });

    // CARREGAR ATIVIDADES ENVIADAS
    function carregarAtividadesEnviadas() {
        fetch("../api/reportApi.php?action=list")
            .then((response) => response.json())
            .then((atividades) => {
                exibirAtividadesEnviadas(atividades);
            })
            .catch((error) => console.error("Erro ao carregar atividades:", error));
    }

    // MOSTRAR ATIVIDADES ENVIADAS NO CARD
    function exibirAtividadesEnviadas(atividades) {
        const tabelaBody = document.querySelector(".table tbody");
        tabelaBody.innerHTML = "";

        if (atividades.status === "error") {
            tabelaBody.innerHTML = `<tr><td colspan="5">${atividades.message}</td></tr>`;
            return;
        }

        atividades.forEach((atividade) => {
            const linha = document.createElement("tr");

            // NOME
            const colunaNome = document.createElement("td");
            colunaNome.textContent = atividade.nome;
            linha.appendChild(colunaNome);

            // CATEGORIA
            const colunaCategoria = document.createElement("td");
            colunaCategoria.textContent = atividade.categoria;
            linha.appendChild(colunaCategoria);

            // DATA DE REALIZAÇÃO
            const colunaDataRealizacao = document.createElement("td");
            colunaDataRealizacao.textContent = atividade.data_realizacao;
            linha.appendChild(colunaDataRealizacao);

            // STATUS
            const colunaStatus = document.createElement("td");
            colunaStatus.textContent = atividade.status;
            linha.appendChild(colunaStatus);

            // AÇÕES
            const colunaAcoes = document.createElement("td");
            const divAcoes = document.createElement("div");
            divAcoes.classList.add("d-flex");

            // BTN EDITAR
            if (atividade.status === "Aguardando validacao" || atividade.status === "Invalido") {
                const botaoEditar = document.createElement("button");
                botaoEditar.classList.add("btn", "btn-sm", "btn-primary", "me-2");
                botaoEditar.textContent = "Editar";
                botaoEditar.addEventListener("click", () => { carregarCategorias(); editarAtividade(atividade.id);});
                divAcoes.appendChild(botaoEditar);
            }

            // BTN FEEDBACK
            if (atividade.status === "Invalido") {
                const botaoFeedback = document.createElement("button");
                botaoFeedback.classList.add("btn", "btn-sm", "btn-danger");
                botaoFeedback.textContent = "Feedback";
                botaoFeedback.addEventListener("click", () => visualizarFeedback(atividade.id));
                divAcoes.appendChild(botaoFeedback);
            }

            colunaAcoes.appendChild(divAcoes);
            linha.appendChild(colunaAcoes);

            tabelaBody.appendChild(linha);
        });
    }

    // ABRE MODAL EDITAR ATIVIDADE
    function editarAtividade(id_relatorio) {
        fetch(`../api/reportApi.php?action=get_activity&id_relatorio=${id_relatorio}`)
            .then(response => response.json())
            .then(atividade => {
                if (atividade.status !== "error") {
                    document.getElementById('edit-id-relatorio').value = atividade.id;
                    document.getElementById('edit-nome').value = atividade.nome;
                    document.getElementById('edit-data').value = atividade.data_realizacao;
                    document.getElementById('edit-descricao').value = atividade.texto_reflexao;
                    document.getElementById('edit-categoria').value = atividade.id_categoria;

                    const editModal = new bootstrap.Modal(document.getElementById('editActivityModal'));
                    editModal.show();
                } else {
                    console.error(atividade.message);
                }
            })
            .catch(error => console.error("Erro ao carregar a atividade para edição:", error));
    }

    // ENVIAR DADOS - EDITAR ATIVIDADE
    document.getElementById('edit-activity-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const id_relatorio = document.getElementById('edit-id-relatorio').value;
        const nome = document.getElementById('edit-nome').value;
        const data_realizacao = document.getElementById('edit-data').value;
        const id_categoria = document.getElementById('edit-categoria').value;
        const texto_reflexao = document.getElementById('edit-descricao').value;

        const formData = new FormData();
        formData.append('id_relatorio', id_relatorio);
        formData.append('nome', nome);
        formData.append('data_realizacao', data_realizacao);
        formData.append('id_categoria', id_categoria);
        formData.append('texto_reflexao', texto_reflexao);

        fetch('../api/reportApi.php?action=update', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    alert('Atividade atualizada com sucesso!');
                    const editModal = bootstrap.Modal.getInstance(document.getElementById('editActivityModal'));
                    editModal.hide();
                    carregarAtividadesEnviadas();
                } else {
                    alert('Erro ao atualizar atividade: ' + result.message);
                }
            })
            .catch(error => console.error('Erro ao atualizar a atividade:', error));
    });

    // VISUALIZAR O FEEDBACK
    function visualizarFeedback(id_relatorio) {
        fetch(`../api/reportApi.php?action=feedback&id_relatorio=${id_relatorio}`)
            .then(response => response.json())
            .then(feedback => {
                if (feedback.status !== "error") {
                    document.getElementById('atividadeNome').textContent = feedback.atividade_nome;
                    document.getElementById('feedbackTexto').textContent = feedback.texto_feedback;

                    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
                    feedbackModal.show();
                } else {
                    console.error(feedback.message);
                }
            })
            .catch(error => console.error("Erro ao carregar o feedback:", error));
    }
});

// LOGOUT
document
    .getElementById("logout-btn")
    .addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../api/logout.php";
    });
