<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageReceived implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public Message $message
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('messages.channel');
    }

    public function broadcastAs(): string
    {
        return 'message.received';
    }

    public function broadcastWith(): array
    {
        return [
        'id'          => $this->message->id,
        'sender_id'   => $this->message->sender_id,
        'sender_name' => $this->message->sender->name,
        'message'     => $this->message->message,
        'metadata'    => $this->message->metadata,
        'processed_at'=> optional($this->message->processed_at)->toISOString(),
        'created_at'  => $this->message->created_at->toISOString(),
        ];

    }
}

