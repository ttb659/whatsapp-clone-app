<?php

namespace App\Http\Controllers\API;

use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\File;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'conversation_id' => 'required_without:group_id|exists:conversations,id',
            'group_id' => 'required_without:conversation_id|exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $messages = [];
        
        if ($request->has('conversation_id')) {
            // Verify user is part of the conversation
            $conversation = Conversation::where('id', $request->conversation_id)
                ->where(function ($query) use ($user) {
                    $query->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                })
                ->firstOrFail();
                
            $messages = Message::where('conversation_id', $request->conversation_id)
                ->with(['sender', 'files'])
                ->orderBy('created_at', 'desc')
                ->paginate(50);
        } else {
            // Verify user is part of the group
            $group = Group::findOrFail($request->group_id);
            if (!$group->users()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'You are not a member of this group'], 403);
            }
            
            $messages = Message::where('group_id', $request->group_id)
                ->with(['sender', 'files'])
                ->orderBy('created_at', 'desc')
                ->paginate(50);
        }
        
        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'conversation_id' => 'required_without:group_id|exists:conversations,id',
            'group_id' => 'required_without:conversation_id|exists:groups,id',
            'content' => 'required_without:files|string',
            'files.*' => 'sometimes|file|max:10240', // 10MB max per file
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        // Check if user is part of the conversation or group
        if ($request->has('conversation_id')) {
            $conversation = Conversation::where('id', $request->conversation_id)
                ->where(function ($query) use ($user) {
                    $query->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                })
                ->firstOrFail();
                
            // Create message
            $message = Message::create([
                'sender_id' => $user->id,
                'conversation_id' => $conversation->id,
                'content' => $request->content ?? '',
            ]);
            
            // Update conversation last_message_at
            $conversation->update(['last_message_at' => now()]);
        } else {
            $group = Group::findOrFail($request->group_id);
            if (!$group->users()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'You are not a member of this group'], 403);
            }
            
            // Create message
            $message = Message::create([
                'sender_id' => $user->id,
                'group_id' => $group->id,
                'content' => $request->content ?? '',
            ]);
        }
        
        // Handle file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $uploadedFile) {
                $path = $uploadedFile->store('message_files', 'public');
                
                File::create([
                    'message_id' => $message->id,
                    'path' => $path,
                    'type' => $uploadedFile->getClientMimeType(),
                    'name' => $uploadedFile->getClientOriginalName(),
                    'size' => $uploadedFile->getSize(),
                ]);
            }
        }
        
        // Load relationships
        $message->load(['sender', 'files']);
        
        // Broadcast message event with Laravel Echo
        broadcast(new MessageSent($message))->toOthers();
        
        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        
        $message = Message::with(['sender', 'files'])
            ->findOrFail($id);
            
        // Check if user has access to this message
        if ($message->conversation_id) {
            $conversation = Conversation::where('id', $message->conversation_id)
                ->where(function ($query) use ($user) {
                    $query->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                })
                ->firstOrFail();
        } else if ($message->group_id) {
            $group = Group::findOrFail($message->group_id);
            if (!$group->users()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'You do not have access to this message'], 403);
            }
        } else {
            return response()->json(['message' => 'Invalid message'], 400);
        }
        
        return response()->json($message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $message = Message::findOrFail($id);
        
        // Only the sender can update the message
        if ($message->sender_id !== $user->id) {
            return response()->json(['message' => 'You are not authorized to update this message'], 403);
        }
        
        // Check if user has access to this message
        if ($message->conversation_id) {
            $conversation = Conversation::where('id', $message->conversation_id)
                ->where(function ($query) use ($user) {
                    $query->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                })
                ->firstOrFail();
        } else if ($message->group_id) {
            $group = Group::findOrFail($message->group_id);
            if (!$group->users()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'You do not have access to this message'], 403);
            }
        } else {
            return response()->json(['message' => 'Invalid message'], 400);
        }
        
        $message->update([
            'content' => $request->content,
            'is_edited' => true,
        ]);
        
        // Load relationships
        $message->load(['sender', 'files']);
        
        // Broadcast message update event with Laravel Echo
        broadcast(new MessageSent($message))->toOthers();
        
        return response()->json([
            'message' => 'Message updated successfully',
            'data' => $message
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        
        $message = Message::findOrFail($id);
        
        // Only the sender can delete the message
        if ($message->sender_id !== $user->id) {
            return response()->json(['message' => 'You are not authorized to delete this message'], 403);
        }
        
        // Check if user has access to this message
        if ($message->conversation_id) {
            $conversation = Conversation::where('id', $message->conversation_id)
                ->where(function ($query) use ($user) {
                    $query->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                })
                ->firstOrFail();
        } else if ($message->group_id) {
            $group = Group::findOrFail($message->group_id);
            if (!$group->users()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'You do not have access to this message'], 403);
            }
        } else {
            return response()->json(['message' => 'Invalid message'], 400);
        }
        
        // Delete associated files from storage
        foreach ($message->files as $file) {
            Storage::disk('public')->delete($file->path);
            $file->delete();
        }
        
        // Store IDs before deleting
        $messageId = $message->id;
        $conversationId = $message->conversation_id;
        $groupId = $message->group_id;
        
        // Delete the message
        $message->delete();
        
        // Broadcast message delete event with Laravel Echo
        broadcast(new MessageDeleted($messageId, $conversationId, $groupId))->toOthers();
        
        return response()->json([
            'message' => 'Message deleted successfully'
        ]);
    }
}
