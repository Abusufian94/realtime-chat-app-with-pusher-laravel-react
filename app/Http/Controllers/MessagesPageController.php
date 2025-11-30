<?php

// app/Http/Controllers/MessagesPageController.php

namespace App\Http\Controllers;

use App\Models\Message;
use Inertia\Inertia;
use Inertia\Response;

class MessagesPageController extends Controller
{
    public function index(): Response
    {
        $messages = Message::with('sender:id,name')
            ->latest()
            ->take(50)
            ->get()
            ->reverse()   // oldest first in UI
            ->values()
            ->map(function ($m) {
                return [
                    'id'           => $m->id,
                    'sender_id'    => $m->sender_id,
                    'sender_name'  => $m->sender->name,
                    'message'      => $m->message,
                    'processed_at' => $m->processed_at?->toISOString(),
                    'created_at'   => $m->created_at->toISOString(),
                ];
            });

        return Inertia::render('messages/index', [
            'messages' => $messages,
            'user'     => auth()->user(),
        ]);
    }
}
    