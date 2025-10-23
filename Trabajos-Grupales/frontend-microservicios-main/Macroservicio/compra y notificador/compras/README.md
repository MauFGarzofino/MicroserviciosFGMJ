### Para crear un API controller
php artisan make:controller NombreDelController --api

### Para crear el modelo y la migración 
php artisan make:model Compra -m

### Para crear la verificación del JWT
php artisan make:middleware VerificarJWT

### Instalar la librería JWT
composer require firebase/php-jwt

### Crear un Job de Laravel para enviar notificaciones
php artisan make:job SendPurchaseNotification

### Levantar el worke
php artisan queue:work