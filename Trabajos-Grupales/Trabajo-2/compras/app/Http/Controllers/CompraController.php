<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CompraController extends Controller
{
    public function index()
    {
        return Compra::all();
    }

    public function store(Request $request)
    {
        Log::info('Entrando a store', $request->all());

        $compra = Compra::create([
            'evento_id' => $request->evento_id,
            'usuario_id' => $request->usuario_id,
            'cantidad' => $request->cantidad,
            'pagado' => false,
        ]);

        Log::info('Compra creada', ['id' => $compra->id]);

        return response()->json($compra, 201);
    }

    public function pagar($id)
    {
        $compra = Compra::find($id);
        if (!$compra) {
            return response()->json(['error' => 'Compra no encontrada'], 404);
        }

        $compra->pagado = true;
        $compra->save();

        return response()->json(['mensaje' => 'Compra pagada']);
    }
}