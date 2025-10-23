<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    protected $fillable = ['evento_id', 'usuario_id', 'cantidad', 'pagado'];
}
