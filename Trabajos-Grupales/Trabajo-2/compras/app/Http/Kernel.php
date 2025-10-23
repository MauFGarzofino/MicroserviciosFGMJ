<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
    'api' => [
        // Middleware por defecto de Laravel
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,

        // Tu middleware personalizado
        \App\Http\Middleware\VerificarJWT::class,
    ],
];
}