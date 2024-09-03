<?php
include '../functions.php';

$data = json_decode(file_get_contents("php://input"), true);

$tipo = $data['tipo'];
$nome = mysqli_real_escape_string($connection, $data['nome']);
$email = mysqli_real_escape_string($connection, $data['email']);
$senha = mysqli_real_escape_string($connection, $data['senha']);

$colunas = "nome, email, senha, tipo";
$valores = "'$nome', '$email', '$senha', '$tipo'";

$usuario_result = inserir_dado("usuario", $colunas, $valores);

if ($usuario_result['status'] === 'success') {
    $id_usuario = $usuario_result['insert_id'];

    switch ($tipo) {
        case 'aluno':
            $matricula = mysqli_real_escape_string($connection, $data['matricula']);
            $id_curso = intval($data['id_curso']);
            $colunas_aluno = "id_usuario, matricula, id_curso";
            $valores_aluno = "$id_usuario, '$matricula', $id_curso";
            inserir_dado("aluno", $colunas_aluno, $valores_aluno);
            break;
        case 'coordenador':
            $id_curso_responsavel = intval($data['id_curso_responsavel']);
            $colunas_coordenador = "id_usuario, id_curso_responsavel";
            $valores_coordenador = "$id_usuario, $id_curso_responsavel";
            inserir_dado("coordenador", $colunas_coordenador, $valores_coordenador);
            break;
        case 'professor':
            inserir_dado("professor", "id_usuario", $id_usuario);
            break;
        default:
            break;
    }

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $usuario_result['message']]);
}

mysqli_close($connection);
?>
