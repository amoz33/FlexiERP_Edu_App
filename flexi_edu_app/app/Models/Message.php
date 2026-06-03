<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_type',
        'sender_id',
        'subject',
        'body',
        'is_read',
        'school_id'
    ];
    
    protected $casts = [
        'is_read' => 'boolean'
    ];

    public function conversation() { 
        return $this->belongsTo(Conversation::class); 
    }

}
