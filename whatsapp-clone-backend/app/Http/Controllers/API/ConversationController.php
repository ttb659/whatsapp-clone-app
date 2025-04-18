<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        $conversations = Conversation::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne', 'userTwo', 'messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();
            
        return response()->json($conversations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $currentUser = Auth::user();
        $otherUser = User::findOrFail($request->user_id);
        
        // Check if conversation already exists
        $existingConversation = Conversation::where(function ($query) use ($currentUser, $otherUser) {
            $query->where('user_one_id', $currentUser->id)
                  ->where('user_two_id', $otherUser->id);
        })->orWhere(function ($query) use ($currentUser, $otherUser) {
            $query->where('user_one_id', $otherUser->id)
                  ->where('user_two_id', $currentUser->id);
        })->first();
        
        if ($existingConversation) {
            return response()->json([
                'message' => 'Conversation already exists',
                'conversation' => $existingConversation
            ]);
        }
        
        // Create new conversation
        $conversation = Conversation::create([
            'user_one_id' => $currentUser->id,
            'user_two_id' => $otherUser->id,
            'last_message_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Conversation created successfully',
            'conversation' => $conversation
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        
        $conversation = Conversation::where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                      ->orWhere('user_two_id', $user->id);
            })
            ->with(['userOne', 'userTwo', 'messages.sender', 'messages.files'])
            ->firstOrFail();
            
        return response()->json($conversation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        
        $conversation = Conversation::where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                      ->orWhere('user_two_id', $user->id);
            })
            ->firstOrFail();
            
        $conversation->update([
            'last_message_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Conversation updated successfully',
            'conversation' => $conversation
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        
        $conversation = Conversation::where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                      ->orWhere('user_two_id', $user->id);
            })
            ->firstOrFail();
            
        // Delete all messages in the conversation
        $conversation->messages()->delete();
        
        // Delete the conversation
        $conversation->delete();
        
        return response()->json([
            'message' => 'Conversation deleted successfully'
        ]);
    }
}
