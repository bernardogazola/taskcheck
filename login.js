document.addEventListener("DOMContentLoaded", function () {
  // CLICAR BOTÃO LISTAR USUARIOS - AQUI O CARD DA LISTA É EXIBIDO
  document
    .getElementById("listar-usuarios-btn")
    .addEventListener("click", function () {
      const userListContainer = document.getElementById("user-list-container");
      userListContainer.style.display = "block";
      carregarUsuarios();
    });

  // LOGIN
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      fetch("login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, senha: senha }),
      })
        .then((response) => response.json())
        .then((data) => {
          const messageContainer = document.getElementById("response-message");

          if (data.status === "success") {
            messageContainer.innerHTML = `<p class="text-success">Login realizado com sucesso! Bem-vindo, ${data.user.nome} (${data.user.tipo})</p>`;
          } else {
            messageContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
          }
        })
        .catch((error) => console.error("Erro:", error));
    });

  // CURSOS - MODAL ADICIONAR USUÁRIOS
  document
    .getElementById("adicionar-usuario-btn")
    .addEventListener("click", carregarCursos);

  // CAMPOS PARA CADA TIPO DE USER
  document.getElementById("tipo").addEventListener("change", function () {
    const tipoUsuario = this.value;
    const alunoFields = document.getElementById("aluno-fields");
    const coordenadorFields = document.getElementById("coordenador-fields");

    alunoFields.style.display = "none";
    coordenadorFields.style.display = "none";

    if (tipoUsuario === "aluno") {
      alunoFields.style.display = "block";
    } else if (tipoUsuario === "coordenador") {
      coordenadorFields.style.display = "block";
    }
  });

  // FORMULARIO ADICIONAR
  document
    .getElementById("form-adicionar-usuario")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const tipo = document.getElementById("tipo").value;
      const nome = document.getElementById("nome-usuario").value;
      const email = document.getElementById("email-usuario").value;
      const senha = document.getElementById("senha-usuario").value;
      const matricula = document.getElementById("matricula").value;
      const cursoAluno = document.getElementById("curso-aluno").value;
      const cursoCoordenador =
        document.getElementById("curso-coordenador").value;

      const usuarioData = {
        tipo: tipo,
        nome: nome,
        email: email,
        senha: senha,
      };

      if (tipo === "aluno") {
        usuarioData.matricula = matricula;
        usuarioData.id_curso = cursoAluno;
      } else if (tipo === "coordenador") {
        usuarioData.id_curso_responsavel = cursoCoordenador;
      }

      fetch("./crud_inicial/adicionar_usuario.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Usuário adicionado com sucesso!");
            document.querySelector("#adicionarUsuarioModal .btn-close").click();
            carregarUsuarios();
          } else {
            alert("Erro ao adicionar usuário: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    });

  // FORMULARIO ATUALIZAR
  document
    .getElementById("form-atualizar-usuario")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const id = document.getElementById("atualizar-id-usuario").value;
      const nome = document.getElementById("atualizar-nome").value;
      const email = document.getElementById("atualizar-email").value;
      const senha = document.getElementById("atualizar-senha").value;

      const usuarioData = {
        id: id,
        nome: nome,
        email: email,
        senha: senha,
      };

      fetch("./crud_inicial/atualizar_usuario.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Usuário atualizado com sucesso!");
            document.querySelector("#atualizarUsuarioModal .btn-close").click();
            carregarUsuarios();
          } else {
            alert("Erro ao atualizar usuário: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    });
});

// CARREGAR CURSOS + DROPDOWN
function carregarCursos() {
  fetch("./crud_inicial/obter_cursos.php")
    .then((response) => response.json())
    .then((cursos) => {
      const cursoAlunoDropdown = document.getElementById("curso-aluno");
      const cursoCoordenadorDropdown =
        document.getElementById("curso-coordenador");
      cursoAlunoDropdown.innerHTML = "";
      cursoCoordenadorDropdown.innerHTML = "";

      cursos.forEach((curso) => {
        const option = document.createElement("option");
        option.value = curso.id;
        option.text = curso.nome;
        cursoAlunoDropdown.add(option.cloneNode(true));
        cursoCoordenadorDropdown.add(option);
      });
    })
    .catch((error) => console.error("Erro ao carregar os cursos:", error));
}

// CARREGAR USUARIOS
function carregarUsuarios() {
  fetch("./crud_inicial/listar_usuarios.php")
    .then((response) => response.json())
    .then((data) => {
      const tabelaBody = document.querySelector("#lista_usuarios tbody");
      tabelaBody.innerHTML = "";

      data.forEach((usuario) => {
        const linha = document.createElement("tr");

        const colunaAcao = document.createElement("td");
        colunaAcao.className = "d-flex justify-content-start";

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-danger me-2";
        botaoExcluir.addEventListener("click", function () {
          excluirUsuario(usuario.id);
        });

        const botaoAtualizar = document.createElement("button");
        botaoAtualizar.textContent = "Atualizar";
        botaoAtualizar.className = "btn btn-warning";
        botaoAtualizar.addEventListener("click", function () {
          abrirModalAtualizar(usuario.id, usuario.nome, usuario.email);
        });

        colunaAcao.appendChild(botaoExcluir);
        colunaAcao.appendChild(botaoAtualizar);
        linha.appendChild(colunaAcao);

        const colunaNome = document.createElement("td");
        colunaNome.textContent = usuario.nome;
        linha.appendChild(colunaNome);

        const colunaEmail = document.createElement("td");
        colunaEmail.textContent = usuario.email;
        linha.appendChild(colunaEmail);

        const colunaSenha = document.createElement("td");
        colunaSenha.textContent = usuario.senha;
        linha.appendChild(colunaSenha);

        const colunaTipo = document.createElement("td");
        colunaTipo.textContent = usuario.tipo;
        linha.appendChild(colunaTipo);

        tabelaBody.appendChild(linha);
      });
    })
    .catch((error) => console.error("Erro ao carregar os usuários:", error));
}

// EXCLUIR USUARIO
function excluirUsuario(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    fetch(`./crud_inicial/excluir_usuario.php?id=${id}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Usuário excluído com sucesso!");
          carregarUsuarios();
        } else {
          alert("Erro ao excluir usuário: " + data.message);
        }
      })
      .catch((error) => console.error("Erro ao excluir o usuário:", error));
  }
}

// ABRIR MODAL ATUALIZAR
function abrirModalAtualizar(id, nome, email) {
  document.getElementById("atualizar-id-usuario").value = id;
  document.getElementById("atualizar-nome").value = nome;
  document.getElementById("atualizar-email").value = email;

  let atualizarUsuarioModal = new bootstrap.Modal(
    document.getElementById("atualizarUsuarioModal")
  );
  atualizarUsuarioModal.show();
}