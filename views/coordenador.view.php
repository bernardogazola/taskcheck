<?php
session_start();

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo'] != 'coordenador') {
    header("Location: /");
    exit();
}
?>

<?php require 'partials/head.php' ?>
<?php require 'partials/header.php' ?>
<?php require 'partials/sidebar.php' ?>
    <div class="content" id="content">
        <!-- ADICIONAR CATEGORIA -->
        <div class="card shadow-sm p-4 mt-5 mx-auto" style="max-width: 1200px;">
            <h3 class="text-center mb-4">Categoria</h3>
            <form>
                <div class="mb-3">
                    <label for="nome" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="nome" placeholder="Digite o nome da categoria">
                </div>
                <div class="mb-3">
                    <label for="categoria" class="form-label">Categoria</label>
                    <select id="categoria" class="form-select">
                        <option selected>Selecionar categoria</option>
                        <!-- CATEGORIAS -->
                    </select>
                </div>
                <div class="mb-3">
                    <label for="carga-horaria" class="form-label">Carga horária</label>
                    <div class="d-flex align-items-center">
                        <input type="range" class="form-range flex-grow-1" id="carga-horaria" min="0" max="100">
                        <div class="input-group ms-3" style="max-width: 150px;">
                            <input type="text" class="form-control" id="horas" placeholder="00">
                            <span class="input-group-text">Horas</span>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <label for="descricao" class="form-label">Descrição</label>
                    <textarea class="form-control" id="descricao" rows="4" placeholder="Digite a descrição"></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-plus-circle"></i> Adicionar
                </button>
            </form>
        </div>
    </div>
<?php require 'partials/footer.php' ?>