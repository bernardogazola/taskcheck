<?php
session_start();

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo'] != 'professor') {
    header("Location: /");
    exit();
}
?>
<?php require 'partials/head.php'; ?>
<?php require 'partials/header.php'; ?>
<?php require 'partials/sidebar.php'; ?>
<div class="content" id="content">
    <!-- RELATÓRIOS SUBMETIDOS -->
    <div class="container mt-5" id="sent-reports-card" style="display: none;">
        <div class="card p-4">
            <h2 class="card-title mb-4">Relatórios Submetidos</h2>

            <div class="row mb-4">
                <div class="col-md-6">
                    <input type="text" class="form-control" id="pesquisarAtividades" placeholder="Pesquisar">
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filtrarAtividades">
                        <option selected>Filtrar</option>
                        <option value="1">Opção 1</option>
                        <option value="2">Opção 2</option>
                        <option value="3">Opção 3</option>
                    </select>
                </div>
                <div class="col-md-3 text-end">
                    <button class="btn btn-primary">Filtrar</button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>Nome do Relatório</th>
                        <th>Curso</th>
                        <th>Categoria</th>
                        <th>Aluno</th>
                        <th>Data de Realização</th>
                        <th>Status</th>
                        <th>Certificado</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<?php require 'partials/footer.php'; ?>
