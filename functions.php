<?php
function urlFind() {
    return $_SERVER['REQUEST_URI'];
}
function urlIs($valor) {
    return $_SERVER['REQUEST_URI'] == $valor;
}
