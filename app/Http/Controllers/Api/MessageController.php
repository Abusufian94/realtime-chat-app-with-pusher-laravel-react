<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Jobs\ProcessMessageJob;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create([
            'sender_id' => $request->input('sender_id'),
            'message'   => $request->input('message'),
        ]);

        ProcessMessageJob::dispatch($message->id);

        return response()->json([
            'success'    => true,
            'message_id' => $message->id,
        ], 201);
    }
}
