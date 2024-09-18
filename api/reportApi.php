<?php
session_start();

global $connection;
include '../database/database.php';
include '../database/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['tipo']) || $_SESSION['tipo'] !== 'aluno') {
    json_return(["status" => "error", "message" => "Usuário não autenticado ou sem permissão."]);
    exit();
}

$id_usuario = $_SESSION['id_usuario'];

if ($method === "POST") {
    switch ($action) {
        case 'add':
            // VERIFICAR NECESSIDADE DE ISSET POIS JÁ É TRATADO EM adicionarAtividade($dados) --------- LEMBRARRRRRRRRRRRRRRRRR
            if (isset($_POST['nome']) && isset($_POST['data_realizacao']) && isset($_POST['id_categoria']) && isset($_POST['texto_reflexao'])) {
                adicionarAtividade($_POST);
            } else {
                json_return(["status" => "error", "message" => "Dados incompletos."]);
            }
            break;
        case 'update':
            if (isset($_POST['id_relatorio'])) {
                atualizarAtividade($_POST);
            } else {
                json_return(["status" => "error", "message" => "ID do relatório não fornecido."]);
            }
            break;
        default:
            json_return(["status" => "error", "message" => "Ação não encontrada."]);
            break;
    }
} elseif ($method === "GET") {
    switch ($action) {
        case 'list':
            listarAtividadesEnviadas($id_usuario);
            break;
        case 'feedback':
            if (isset($_GET['id_relatorio'])) {
                obterFeedback($_GET['id_relatorio']);
            } else {
                json_return(["status" => "error", "message" => "ID do relatório não fornecido."]);
            }
            break;
        case 'get_activity':
            if (isset($_GET['id_relatorio'])) {
                obterAtividade($_GET['id_relatorio']);
            } else {
                json_return(["status" => "error", "message" => "ID do relatório não fornecido."]);
            }
            break;
        default:
            json_return(["status" => "error", "message" => "Ação não encontrada."]);
            break;
    }
} else {
    json_return(["status" => "error", "message" => "Método não suportado"]);
}

function adicionarAtividade($dados) {
    global $connection;
    $id_aluno = $_SESSION['id_usuario'];

    if (empty($dados['nome']) || empty($dados['data_realizacao']) || empty($dados['id_categoria']) || empty($dados['texto_reflexao']) || $dados['id_categoria'] === 'Selecionar categoria') {
        json_return(["status" => "error", "message" => "Dados incompletos."]);
        return;
    }

    $nome = mysqli_real_escape_string($connection, $dados['nome']);
    $data_realizacao = mysqli_real_escape_string($connection, $dados['data_realizacao']);
    $id_categoria = mysqli_real_escape_string($connection, $dados['id_categoria']);
    $texto_reflexao = mysqli_real_escape_string($connection, $dados['texto_reflexao']);
    $data_envio = date('Y-m-d');
    $status = 'Aguardando validacao';

    // FORMATAR DD/MM/AAAA PARA AAAA-MM-DD
    $data_realizacao_formatada = date_format(date_create_from_format('d/m/Y', $data_realizacao), 'Y-m-d');

    if (isset($_FILES['certificado']) && $_FILES['certificado']['error'] === UPLOAD_ERR_OK) {
        $certificado = file_get_contents($_FILES['certificado']['tmp_name']);
        $certificado = mysqli_real_escape_string($connection, $certificado);
    } else {
        $certificado = null;
    }

    $colunas = "nome, data_realizacao, id_categoria, texto_reflexao, data_envio, status, id_aluno, certificado";
    $valores = "'$nome', '$data_realizacao_formatada', $id_categoria, '$texto_reflexao', '$data_envio', '$status', $id_aluno, '$certificado'";

    $resultado = inserir_dado("relatorio_atividade", $colunas, $valores);

    if ($resultado['status'] === 'success') {
        json_return(["status" => "success", "message" => "Atividade adicionada com sucesso"]);
    } else {
        json_return(["status" => "error", "message" => "Erro ao adicionar a atividade: " . $resultado['message']]);
    }
}

function listarAtividadesEnviadas($id_usuario) {
    $query = "
        SELECT 
            r.id,
            r.nome,
            c.nome AS categoria,
            r.data_realizacao,
            r.status
        FROM relatorio_atividade r
        INNER JOIN categoria c ON r.id_categoria = c.id
        WHERE r.id_aluno = $id_usuario
        ORDER BY r.data_envio DESC
    ";

    $atividades = consultar_dado($query);

    if (is_array($atividades) && count($atividades) > 0) {
        json_return($atividades);
    } else {
        json_return(["status" => "error", "message" => "Nenhuma atividade encontrada."]);
    }
}

function atualizarAtividade($dados) {
    global $connection;

    $id_relatorio = mysqli_real_escape_string($connection, $dados['id_relatorio']);
    $nome = mysqli_real_escape_string($connection, $dados['nome']);
    $data_realizacao = mysqli_real_escape_string($connection, $dados['data_realizacao']);
    $id_categoria = mysqli_real_escape_string($connection, $dados['id_categoria']);
    $texto_reflexao = mysqli_real_escape_string($connection, $dados['texto_reflexao']);

    // FORMATAR DD/MM/AAAA PARA AAAA-MM-DD ------ LEMBRAR DE ADICIONAR POSTERIORMENTE
    //$data_realizacao_formatada = date_format(date_create_from_format('d/m/Y', $data_realizacao), 'Y-m-d');

    $atributos = "nome = '$nome', data_realizacao = '$data_realizacao', id_categoria = $id_categoria, texto_reflexao = '$texto_reflexao'";
    $condicao = "id = $id_relatorio";

    $resultado = atualizar_dado('relatorio_atividade', $atributos, $condicao);

    if ($resultado['status'] === 'success') {
        json_return(["status" => "success", "message" => "Atividade atualizada com sucesso"]);
    } else {
        json_return(["status" => "error", "message" => "Erro ao atualizar a atividade: " . $resultado['message']]);
    }
}

function obterAtividade($id_relatorio) {
    $query = "
        SELECT 
            r.id,
            r.nome,
            r.texto_reflexao,
            r.data_realizacao,
            r.id_categoria,
            r.certificado
        FROM relatorio_atividade r
        WHERE r.id = $id_relatorio
    ";

    $atividade = consultar_dado($query);

    if (is_array($atividade) && count($atividade) > 0) {
        json_return($atividade[0]);
    } else {
        json_return(["status" => "error", "message" => "Atividade não encontrada."]);
    }
}

function obterFeedback($id_relatorio) {
    $query = "
        SELECT 
            f.texto_feedback,
            r.nome AS atividade_nome
        FROM feedback f
        INNER JOIN relatorio_atividade r ON f.id_relatorio = r.id
        WHERE f.id_relatorio = $id_relatorio
    ";

    $feedback = consultar_dado($query);

    if (is_array($feedback) && count($feedback) > 0) {
        json_return($feedback[0]);
    } else {
        json_return(["status" => "error", "message" => "Feedback não encontrado."]);
    }
}
?>
