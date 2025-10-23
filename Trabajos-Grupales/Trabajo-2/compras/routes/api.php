<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompraController;
use App\Http\Middleware\VerificarJWT;

Route::middleware([VerificarJWT::class])->group(function () {
    Route::get('/compras', [CompraController::class, 'index']);
    Route::post('/compras', [CompraController::class, 'store']);
    Route::post('/compras/{id}/pagar', [CompraController::class, 'pagar']);
});