<?php
include '../functions.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $resultado = deletar_dado("usuario", "id = $id");

    json_return($resultado);
} else {
    json_return(["status" => "error", "message" => "ID do usuário não especificado."]);
}

mysqli_close($connection);
?>
