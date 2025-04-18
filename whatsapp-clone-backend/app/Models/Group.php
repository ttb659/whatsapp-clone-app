<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'image',
        'creator_id',
        'last_message_at',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_message_at' => 'datetime',
    ];
    
    /**
     * Get the creator of the group.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
    
    /**
     * Get the members of the group.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('is_admin')->withTimestamps();
    }
    
    /**
     * Get the messages in the group.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
