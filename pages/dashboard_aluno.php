<?php
session_start();

if (!isset($_SESSION['id_usuario'])) {
    header("Location: ../index.php");
    exit();
}
?>

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskCheck - Relatório de Atividade</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../assets/css/dashboard_aluno.css" />
  </head>

  <body>
    <div
      class="header position-fixed d-flex justify-content-between align-items-center p-3"
    >
      <h2 class="mb-0">TaskCheck</h2>
      <button id="toggleSidebar" class="btn btn-light">
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <div class="sidebar position-fixed min-vh-100" id="sidebar">
      <a href="#"> <i class="fas fa-plus-circle"></i> Adicionar atividade </a>
      <a href="#"> <i class="fas fa-list"></i> Atividades enviadas </a>
      <a href="#"> <i class="fas fa-cog"></i> Configurações </a>
      <a href="#" id="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
    </div>

    <div class="content" id="content">
      <div class="card p-4">
        <h3 class="card-title mb-4">Relatório de Atividade</h3>
        <form>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="data" class="form-label">Data de realização</label>
              <input
                type="text"
                class="form-control"
                id="data"
                placeholder="DD/MM/AAAA"
              />
            </div>
            <div class="col-md-6">
              <label for="categoria" class="form-label">Categoria</label>
              <select id="categoria" class="form-select">
                <option selected>Selecionar categoria</option>
                <option value="1">Categoria 1</option>
                <option value="2">Categoria 2</option>
                <option value="3">Categoria 3</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input
              type="text"
              class="form-control"
              id="nome"
              placeholder="Informe o nome"
            />
          </div>
          <div class="mb-3">
            <label for="descricao" class="form-label">Descrição</label>
            <textarea
              class="form-control"
              id="descricao"
              rows="3"
              placeholder="Informe a descrição"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="reflexao" class="form-label">Reflexão</label>
            <textarea
              class="form-control"
              id="reflexao"
              rows="3"
              placeholder="Informe a reflexão"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="certificado" class="form-label"
              >Anexar certificado</label
            >
            <input type="file" class="form-control" id="certificado" />
          </div>
          <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
      const toggleSidebarButton = document.getElementById("toggleSidebar");
      const sidebar = document.getElementById("sidebar");
      const content = document.getElementById("content");

      toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        content.classList.toggle("sidebar-hidden");
      });
    </script>
    <script src="../assets/js/dashboard_aluno.js"></script>
  </body>
</html>
