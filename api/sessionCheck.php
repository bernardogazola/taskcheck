<?php
session_start();

include '../database/functions.php';

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    json_return(["status" => "error", "message" => "Usuário não autenticado"]);
} else {
    json_return(["status" => "success", "tipo" => $_SESSION['tipo']]);
}

?>
