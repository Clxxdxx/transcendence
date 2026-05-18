<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $primaryKey = 'id_channel';

    protected $fillable = [
        'name',  
    ];
}
