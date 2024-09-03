<?php
include '../functions.php';

$cursos = consultar_dado("SELECT id, nome FROM curso");

json_return($cursos);
?>
