<?php
session_start();

global $connection;
include '../database/database.php';
include '../database/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['tipo'])) {
    json_return(["status" => "error", "message" => "Usuário não autenticado."]);
    exit();
}

$id_usuario = $_SESSION['id_usuario'];
$tipo_usuario = $_SESSION['tipo'];

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    switch ($action) {
        // ADD,UPDATE FAZER DEPOIS
        default:
            json_return(["status" => "error", "message" => "Ação não encontrada."]);
            break;
    }
} elseif ($method === "GET") {
    switch ($action) {
        case 'list':
            obterCategorias($id_usuario, $tipo_usuario);
            break;
        default:
            json_return(["status" => "error", "message" => "Ação não encontrada."]);
            break;
    }
} else {
    json_return(["status" => "error", "message" => "Método não suportado"]);
}

// CONSULTAR CURSO DO ALUNO E DEPOIS CONSULTAR AS CATEGORIAS ASSOCIADAS AO CURSO
// OBSERVAÇÃO: QUANDO IMPLEMENTAR O COORDENADOR, DEVERÁ OCORRER O MESMO
function obterCategorias($id_usuario, $tipo_usuario) {
    if ($tipo_usuario === 'aluno') {
        $queryCurso = "SELECT id_curso FROM aluno WHERE id_usuario = $id_usuario";
        $cursoResult = consultar_dado($queryCurso);

        if (is_array($cursoResult) && count($cursoResult) > 0) {
            $id_curso = $cursoResult[0]['id_curso'];

            $queryCategorias = "SELECT id, nome, descricao, carga_horaria FROM categoria WHERE id_curso = $id_curso";
            $categorias = consultar_dado($queryCategorias);

            json_return($categorias);
        } else {
            json_return(["status" => "error", "message" => "Curso do aluno não encontrado."]);
        }
    } else {
        json_return(["status" => "error", "message" => "Tipo de usuário não suportado para esta ação."]);
    }
}
?>
