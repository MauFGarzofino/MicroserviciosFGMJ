<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;

class VerificarJWT
{
    public function handle(Request $request, Closure $next)
    {
        $auth = $request->header('Authorization');

        if (!$auth || !str_starts_with($auth, 'Bearer ')) {
            Log::warning('Token no proporcionado');
            return response()->json(['error' => 'Token requerido'], 401);
        }

        $token = explode(' ', $auth)[1];

        try {
            $clave = env('JWT_CLAVE_EXTERNA');
            $datos = JWT::decode($token, new Key($clave, 'HS256'));

            if (isset($datos->exp) && time() > $datos->exp) {
                Log::warning('Token expirado');
                return response()->json(['error' => 'Token expirado'], 401);
            }

            if (!isset($datos->sub)) {
                Log::error('Token sin sub');
                return response()->json(['error' => 'Token inválido'], 401);
            }

            $request->merge(['usuario_id' => $datos->sub]);
            Log::info('Token válido para usuario_id: ' . $datos->sub);

        } catch (\Exception $e) {
            Log::error('Error al decodificar token: ' . $e->getMessage());
            return response()->json(['error' => 'Token inválido'], 401);
        }

        return $next($request);
    }
}
