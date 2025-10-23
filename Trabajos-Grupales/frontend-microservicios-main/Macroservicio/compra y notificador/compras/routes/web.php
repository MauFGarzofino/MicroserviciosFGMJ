<?php

use Illuminate\Support\Facades\Route;
use PhpAmqpLib\Connection\AMQPStreamConnection;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-rabbit', function () {
    try {
        $connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST'),
            env('RABBITMQ_PORT'),
            env('RABBITMQ_USER'),
            env('RABBITMQ_PASSWORD')
        );
        $connection->close();
        return 'Conexión a RabbitMQ exitosa 🎉';
    } catch (\Exception $e) {
        return 'Error al conectar a RabbitMQ: ' . $e->getMessage();
    }
});