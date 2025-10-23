<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\RabbitMQService;

class CompraController extends Controller
{
    public function index()
    {
        return response()->json(Compra::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'evento_id' => 'required|integer',
            'cantidad' => 'required|integer|min:1',
        ]);

        $compra = Compra::create([
            'evento_id' => $validated['evento_id'],
            'usuario_id' => $request->usuario_id,
            'cantidad' => $validated['cantidad'],
            'pagado' => false,
        ]);

        return response()->json($compra, 201);
    }

    public function pagar($id)
    {
        $compra = Compra::findOrFail($id);
        $compra->update(['pagado' => true]);

        // Publicar mensaje en RabbitMQ
        $notificador = new RabbitMQService();
        $notificador->publish([
            'tipo' => 'pago_confirmado',
            'compra_id' => $compra->id,
            'usuario_id' => $compra->usuario_id,
            'evento_id' => $compra->evento_id,
            'cantidad' => $compra->cantidad,
            'fecha' => now()->toDateTimeString()
        ]);

        return response()->json(['mensaje' => 'Compra pagada y notificación enviada a la cola']);
    }

    public function destroy($id)
    {
        $compra = Compra::findOrFail($id);
        $compra->delete();

        return response()->json(['mensaje' => 'Compra eliminada correctamente']);
    }
}
