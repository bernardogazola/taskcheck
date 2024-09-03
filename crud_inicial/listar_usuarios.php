<?php
include '../functions.php';

$usuarios = consultar_dado("SELECT * FROM usuario");

json_return($usuarios);

mysqli_close($connection);
?>
