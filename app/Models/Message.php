<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_id',
        'message',
        'metadata',
        'processed_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
