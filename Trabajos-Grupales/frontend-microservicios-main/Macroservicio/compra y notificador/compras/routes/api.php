<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompraController;

Route::middleware('jwt')->group(function () {
    Route::get('/compras', [CompraController::class, 'index']);
    Route::post('/compras', [CompraController::class, 'store']);
    Route::post('/compras/{id}/pagar', [CompraController::class, 'pagar']);
    Route::delete('/compras/{id}', [CompraController::class, 'destroy']);
});
