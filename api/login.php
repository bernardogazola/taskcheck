<?php
include '../database/database.php';
include '../database/functions.php';

function validarLogin() {
    global $connection;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['email']) && !empty($data['senha'])) {
            $email = mysqli_real_escape_string($connection, $data['email']);
            $senha = mysqli_real_escape_string($connection, $data['senha']);

            $query = "SELECT id, nome, email, tipo 
                      FROM usuario 
                      WHERE email = '$email' AND senha = '$senha'";

            $result = consultar_dado($query);

            if (is_array($result) && count($result) > 0) {
                $user = $result[0];
                json_return(["status" => "success", "user" => $user]);
            } else {
                json_return(["status" => "error", "message" => "Email ou senha incorretos."]);
            }
        } else {
            json_return(["status" => "error", "message" => "Email e senha são obrigatórios."]);
        }
    }
}

validarLogin();

mysqli_close($connection);
?>
