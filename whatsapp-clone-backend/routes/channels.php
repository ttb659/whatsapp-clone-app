<?php

use App\Models\Conversation;
use App\Models\Group;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Conversation channel
Broadcast::channel('conversation.{id}', function ($user, $id) {
    $conversation = Conversation::findOrFail($id);
    return $conversation->user_one_id === $user->id || $conversation->user_two_id === $user->id;
});

// Group channel
Broadcast::channel('group.{id}', function ($user, $id) {
    $group = Group::findOrFail($id);
    return $group->users()->where('user_id', $user->id)->exists();
});