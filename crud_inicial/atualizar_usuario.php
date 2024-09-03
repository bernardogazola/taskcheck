<?php
include '../functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id'], $data['nome'], $data['email'], $data['senha'])) {
        $id = mysqli_real_escape_string($connection, $data['id']);
        $nome = mysqli_real_escape_string($connection, $data['nome']);
        $email = mysqli_real_escape_string($connection, $data['email']);
        $senha = mysqli_real_escape_string($connection, $data['senha']);

        $atributos = "nome = '$nome', email = '$email', senha = '$senha'";
        $result = atualizar_dado('usuario', $atributos, "id = $id");

        json_return($result);
    } else {
        json_return(["status" => "error", "message" => "Dados incompletos."]);
    }
} else {
    json_return(["status" => "error", "message" => "Método de requisição inválido."]);
}

mysqli_close($connection);
?>