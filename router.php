<?php

$uri = parse_url($_SERVER['REQUEST_URI'])['path'];

$routes = [
    '/' => 'controllers/login.php',
    '/aluno' => 'controllers/aluno.php',
    '/coordenador' => 'controllers/coordenador.php',
    '/admin' => 'controllers/admin.php',
];

function routerToController($uri, $routes) {
    if (array_key_exists($uri, $routes)) {
        require $routes[$uri];
    } else {
        abort();
    }
}

// LEMBRAR FINALIZAR ABORT - CHAMAR http_response_code(404) E CRIAR VIEW ADEQUADA
function abort() {
    echo "teste";
}

routerToController($uri, $routes);