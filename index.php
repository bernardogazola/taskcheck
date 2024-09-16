<?php
session_start();

if (isset($_SESSION['id_usuario'])) {
    if ($_SESSION['tipo'] === 'aluno') {
        header("Location: ./pages/dashboard_aluno.php");
        exit();
    } elseif ($_SESSION['tipo'] === 'professor') {
        header("Location: NÃO FIZ");
        exit();
    } elseif ($_SESSION['tipo'] === 'coordenador') {
        header("Location: NÃO FIZ");
        exit();
    }
}
?>

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskCheck - Login</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./assets/css/index.css" />
  </head>

  <body
    class="bg-light d-flex flex-column justify-content-center align-items-center vh-100"
  >
    <div class="container">
      <div class="card shadow-lg p-4 mx-auto mb-4" style="max-width: 450px">
        <div class="text-center">
          <img
            src="./assets/img/logo_pucpr.png"
            alt="PUCPR Grupo Marista"
            class="mt-3 mb-4 w-100"
          />
          <h2 class="mb-4">TaskCheck</h2>
        </div>
        <form id="login-form">
          <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Informe seu e-mail"
            />
          </div>
          <div class="mb-4">
            <label for="senha" class="form-label">Senha</label>
            <input
              type="password"
              class="form-control"
              id="senha"
              placeholder="Informe sua senha"
            />
          </div>
          <button type="submit" class="btn btn-primary w-100 mb-2">
            Entrar
          </button>
        </form>
        <div id="response-message" class="mt-3"></div>
      </div>
    </div>
    <script src="./assets/js/login.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
