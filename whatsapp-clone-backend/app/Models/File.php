<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'message_id',
        'name',
        'path',
        'type',
        'size',
    ];
    
    /**
     * Get the message the file belongs to.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}
