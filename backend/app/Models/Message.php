<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Message extends Model
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'id_message';

    protected $fillable = [
        'id_user',
        'id_channel',
        'content',
        'sent_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class, 'id_channel');
    }
}
