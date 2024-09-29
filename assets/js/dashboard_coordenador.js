document.addEventListener("DOMContentLoaded", function () {
    const toggleSidebarButton = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    const categoriasList = document.getElementById('categorias-list');
    const formEditarCategoria = document.getElementById('form-editar-categoria');
    const formAdicionarCategoria = document.getElementById('form-adicionar-categoria');
    const editRangeCargaHoraria = document.getElementById('edit-carga-horaria');
    const editInputHoras = document.getElementById('edit-horas');
    const addRangeCargaHoraria = document.getElementById('carga-horaria');
    const addInputHoras = document.getElementById('horas');

    // SINCRONIZAR INPUT DE HORAS COM O "RANGE" - MODAL EDIT
    editRangeCargaHoraria.addEventListener('input', function () {
        editInputHoras.value = this.value;
    });

    // SINCRONIZAR INPUT DE HORAS COM O "RANGE" - FORM ADD
    addRangeCargaHoraria.addEventListener('input', function () {
        addInputHoras.value = this.value;
    });

    // BOTÃO SIDEBAR (MOSTRAR/ESCONDER)
    toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        content.classList.toggle("sidebar-hidden");
    });

    // BOTÃO VER CATEGORIAS
    document.getElementById("view-categories-card").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarCardCategorias();
        carregarCategorias();
    });

    // BOTÃO ADICIONAR CATEGORIA
    document.getElementById("add-category-btn").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarFormularioAdicionarCategoria();
    });

    // SUBMISSÃO DO FORMULÁRIO DE ADICIONAR CATEGORIA
    formAdicionarCategoria.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeCategoria = document.getElementById('nome-categoria').value;
        const cargaHoraria = document.getElementById('carga-horaria').value;
        const descricao = document.getElementById('descricao').value;

        const categoriaData = {
            nome: nomeCategoria,
            carga_horaria: cargaHoraria,
            descricao: descricao
        };

        fetch('../api/categoryApi.php?action=add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoriaData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Categoria adicionada com sucesso!');
                    formAdicionarCategoria.reset();
                    mostrarCardCategorias();
                    carregarCategorias();
                } else {
                    alert('Erro ao adicionar categoria: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });

    // MOSTRAR CARD DE CATEGORIAS
    function mostrarCardCategorias() {
        document.getElementById('categories-card').style.display = 'block';
        document.getElementById('add-category-form').style.display = 'none';
    }

    // MOSTRAR FORMULÁRIO DE ADICIONAR CATEGORIA
    function mostrarFormularioAdicionarCategoria() {
        document.getElementById('add-category-form').style.display = 'block';
        document.getElementById('categories-card').style.display = 'none';
    }

    // CARREGAR CATEGORIAS DO COORDENADOR
    function carregarCategorias() {
        fetch("../api/categoryApi.php?action=list")
            .then(response => response.json())
            .then(categorias => {
                exibirCategorias(categorias);
            })
            .catch(error => {
                console.error("Erro ao carregar categorias:", error);
            });
    }

    // EXIBIR CATEGORIAS NA TABELA
    function exibirCategorias(categorias) {
        categoriasList.innerHTML = '';

        if (categorias.status === "error") {
            categoriasList.innerHTML = `<tr><td colspan="3">${categorias.message}</td></tr>`;
            return;
        }

        categorias.forEach(categoria => {
            const row = document.createElement('tr');

            // Nome da Categoria
            const nomeCell = document.createElement('td');
            nomeCell.textContent = categoria.nome;
            row.appendChild(nomeCell);

            // Carga Horária
            const cargaHorariaCell = document.createElement('td');
            cargaHorariaCell.textContent = `${categoria.carga_horaria} horas`;
            row.appendChild(cargaHorariaCell);

            // Ações (Editar, Excluir)
            const acoesCell = document.createElement('td');
            const divAcoes = document.createElement('div');
            divAcoes.classList.add('d-flex');

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function () {
                editarCategoria(categoria.id);
            });
            divAcoes.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.classList.add('btn', 'btn-sm', 'btn-danger');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.addEventListener('click', function () {
                excluirCategoria(categoria.id);
            });
            divAcoes.appendChild(btnExcluir);

            acoesCell.appendChild(divAcoes);
            row.appendChild(acoesCell);

            categoriasList.appendChild(row);
        });
    }

    // FUNÇÃO PARA EDITAR CATEGORIA (ABRIR MODAL)
    function editarCategoria(id_categoria) {
        fetch(`../api/categoryApi.php?action=get&id=${id_categoria}`)
            .then(response => response.json())
            .then(categoria => {
                if (categoria.status !== 'error') {
                    document.getElementById('edit-category-id').value = categoria.id;
                    document.getElementById('edit-nome-categoria').value = categoria.nome;
                    document.getElementById('edit-carga-horaria').value = categoria.carga_horaria;
                    document.getElementById('edit-horas').value = categoria.carga_horaria;
                    document.getElementById('edit-descricao').value = categoria.descricao;

                    const editModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
                    editModal.show();
                } else {
                    alert('Erro ao carregar categoria: ' + categoria.message);
                }
            })
            .catch(error => console.error('Erro ao carregar categoria:', error));
    }

    // SUBMISSÃO DO FORMULÁRIO DE EDIÇÃO
    formEditarCategoria.addEventListener('submit', function (event) {
        event.preventDefault();

        const id_categoria = document.getElementById('edit-category-id').value;
        const nomeCategoria = document.getElementById('edit-nome-categoria').value;
        const cargaHoraria = document.getElementById('edit-carga-horaria').value;
        const descricao = document.getElementById('edit-descricao').value;

        const categoriaData = {
            id: id_categoria,
            nome: nomeCategoria,
            carga_horaria: cargaHoraria,
            descricao: descricao
        };

        fetch('../api/categoryApi.php?action=update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoriaData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Categoria atualizada com sucesso!');
                    carregarCategorias();
                    const editModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
                    editModal.hide();
                } else {
                    alert('Erro ao atualizar categoria: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });

    // FUNÇÃO PARA EXCLUIR CATEGORIA
    function excluirCategoria(id_categoria) {
        if (confirm('Tem certeza que deseja excluir essa categoria?')) {
            fetch(`../api/categoryApi.php?action=delete&id=${id_categoria}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Categoria excluída com sucesso!');
                        carregarCategorias();
                    } else {
                        alert('Erro ao excluir categoria: ' + data.message);
                    }
                })
                .catch(error => console.error('Erro ao excluir categoria:', error));
        }
    }

    // Carregar categorias ao iniciar
    carregarCategorias();
});

// LOGOUT
document
    .getElementById("logout-btn")
    .addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../api/logout.php";
    });