<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService
{
    protected $connection;
    protected $channel;

    public function __construct()
    {
        $this->connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST', 'localhost'),
            env('RABBITMQ_PORT', 5672),
            env('RABBITMQ_USER', 'guest'),
            env('RABBITMQ_PASSWORD', 'guest')
        );

        $this->channel = $this->connection->channel();
        $this->channel->queue_declare(env('RABBITMQ_QUEUE', 'notificaciones'), false, true, false, false);
    }

    public function publish($data)
    {
        $msg = new AMQPMessage(json_encode($data), ['delivery_mode' => 2]);
        $this->channel->basic_publish($msg, '', env('RABBITMQ_QUEUE', 'notificaciones'));
    }

    public function __destruct()
    {
        $this->channel->close();
        $this->connection->close();
    }
}
