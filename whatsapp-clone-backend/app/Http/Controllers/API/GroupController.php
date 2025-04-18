<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        $groups = $user->groups()
            ->with(['users' => function ($query) {
                $query->select('users.id', 'name', 'email');
            }])
            ->withCount('users')
            ->get();
            
        return response()->json($groups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        // Create group
        $group = Group::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $user->id,
        ]);
        
        // Upload group image if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('group_images', 'public');
            $group->update(['image' => $path]);
        }
        
        // Add current user to the group
        $group->users()->attach($user->id, ['is_admin' => true]);
        
        // Add other users to the group
        $userIds = array_diff($request->user_ids, [$user->id]);
        if (!empty($userIds)) {
            $group->users()->attach($userIds);
        }
        
        // Load relationships
        $group->load(['users' => function ($query) {
            $query->select('users.id', 'name', 'email');
        }]);
        $group->loadCount('users');
        
        return response()->json([
            'message' => 'Group created successfully',
            'group' => $group
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        
        $group = Group::with(['users' => function ($query) {
                $query->select('users.id', 'name', 'email');
            }])
            ->withCount('users')
            ->findOrFail($id);
            
        // Check if user is a member of the group
        if (!$group->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }
        
        return response()->json($group);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $group = Group::findOrFail($id);
        
        // Check if user is an admin of the group
        $isAdmin = $group->users()->where('user_id', $user->id)->where('is_admin', true)->exists();
        if (!$isAdmin) {
            return response()->json(['message' => 'You are not authorized to update this group'], 403);
        }
        
        // Update group details
        if ($request->has('name')) {
            $group->name = $request->name;
        }
        
        if ($request->has('description')) {
            $group->description = $request->description;
        }
        
        // Upload new group image if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($group->image) {
                Storage::disk('public')->delete($group->image);
            }
            
            $path = $request->file('image')->store('group_images', 'public');
            $group->image = $path;
        }
        
        $group->save();
        
        // Load relationships
        $group->load(['users' => function ($query) {
            $query->select('users.id', 'name', 'email');
        }]);
        $group->loadCount('users');
        
        return response()->json([
            'message' => 'Group updated successfully',
            'group' => $group
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        
        $group = Group::findOrFail($id);
        
        // Check if user is an admin of the group
        $isAdmin = $group->users()->where('user_id', $user->id)->where('is_admin', true)->exists();
        if (!$isAdmin) {
            return response()->json(['message' => 'You are not authorized to delete this group'], 403);
        }
        
        // Delete group image if exists
        if ($group->image) {
            Storage::disk('public')->delete($group->image);
        }
        
        // Delete all messages in the group
        foreach ($group->messages as $message) {
            // Delete associated files
            foreach ($message->files as $file) {
                Storage::disk('public')->delete($file->path);
                $file->delete();
            }
            $message->delete();
        }
        
        // Detach all users from the group
        $group->users()->detach();
        
        // Delete the group
        $group->delete();
        
        return response()->json([
            'message' => 'Group deleted successfully'
        ]);
    }
    
    /**
     * Add a user to the group.
     */
    public function addUser(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'is_admin' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $group = Group::findOrFail($id);
        
        // Check if user is an admin of the group
        $isAdmin = $group->users()->where('user_id', $user->id)->where('is_admin', true)->exists();
        if (!$isAdmin) {
            return response()->json(['message' => 'You are not authorized to add users to this group'], 403);
        }
        
        // Check if user is already in the group
        if ($group->users()->where('user_id', $request->user_id)->exists()) {
            return response()->json(['message' => 'User is already in the group'], 400);
        }
        
        // Add user to the group
        $group->users()->attach($request->user_id, [
            'is_admin' => $request->is_admin ?? false,
        ]);
        
        // Load relationships
        $group->load(['users' => function ($query) {
            $query->select('users.id', 'name', 'email');
        }]);
        $group->loadCount('users');
        
        return response()->json([
            'message' => 'User added to group successfully',
            'group' => $group
        ]);
    }
    
    /**
     * Remove a user from the group.
     */
    public function removeUser(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $group = Group::findOrFail($id);
        
        // Check if user is an admin of the group or is removing themselves
        $isAdmin = $group->users()->where('user_id', $user->id)->where('is_admin', true)->exists();
        $isSelf = $user->id == $request->user_id;
        
        if (!$isAdmin && !$isSelf) {
            return response()->json(['message' => 'You are not authorized to remove users from this group'], 403);
        }
        
        // Check if user is in the group
        if (!$group->users()->where('user_id', $request->user_id)->exists()) {
            return response()->json(['message' => 'User is not in the group'], 400);
        }
        
        // Cannot remove the last admin
        if ($group->users()->where('is_admin', true)->count() <= 1 && 
            $group->users()->where('user_id', $request->user_id)->where('is_admin', true)->exists()) {
            return response()->json(['message' => 'Cannot remove the last admin from the group'], 400);
        }
        
        // Remove user from the group
        $group->users()->detach($request->user_id);
        
        // Load relationships
        $group->load(['users' => function ($query) {
            $query->select('users.id', 'name', 'email');
        }]);
        $group->loadCount('users');
        
        return response()->json([
            'message' => 'User removed from group successfully',
            'group' => $group
        ]);
    }
}
