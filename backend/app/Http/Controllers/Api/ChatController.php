<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $conversations = Conversation::where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->with(['userOne:id,name,role,profile_image', 'userTwo:id,name,role,profile_image'])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->where('sender_id', '!=', $userId)->whereNull('read_at');
            }])
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $conversations,
            'message' => 'Conversations retrieved successfully'
        ]);
    }

    public function show(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;
        
        if ($conversation->user_one_id !== $userId && $conversation->user_two_id !== $userId) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()->with('sender:id,name,profile_image')->get();

        return response()->json([
            'status' => 'success',
            'data' => $messages,
            'message' => 'Messages retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $senderId = $request->user()->id;
        $receiverId = $validated['receiver_id'];

        if ($senderId == $receiverId) {
            return response()->json(['status' => 'error', 'message' => 'Cannot send message to yourself'], 400);
        }

        $conversation = Conversation::where(function ($query) use ($senderId, $receiverId) {
            $query->where('user_one_id', $senderId)->where('user_two_id', $receiverId);
        })->orWhere(function ($query) use ($senderId, $receiverId) {
            $query->where('user_one_id', $receiverId)->where('user_two_id', $senderId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_one_id' => $senderId,
                'user_two_id' => $receiverId
            ]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $senderId,
            'content' => $validated['content']
        ]);

        $conversation->touch();

        return response()->json([
            'status' => 'success',
            'data' => $message->load('sender:id,name,profile_image'),
            'message' => 'Message sent successfully'
        ], 201);
    }
}
