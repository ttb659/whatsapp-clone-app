<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sender_id',
        'content',
        'is_read',
        'conversation_id',
        'group_id',
        'is_group_message',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_read' => 'boolean',
        'is_group_message' => 'boolean',
    ];
    
    /**
     * Get the sender of the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    
    /**
     * Get the conversation the message belongs to.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
    
    /**
     * Get the group the message belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }
    
    /**
     * Get the files attached to the message.
     */
    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }
}
