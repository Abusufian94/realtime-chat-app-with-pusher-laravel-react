<?php

namespace App\Jobs;

use App\Events\MessageReceived;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class ProcessMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
      public function __construct(
        public int $messageId
    ) {}

    public function handle(): void
    {
        $message = Message::find($this->messageId);

        if (! $message) {
            return;
        }

        // Example processing: sanitize + add metadata
        $sanitized = strip_tags($message->message);

        $meta = $message->metadata ?? [];
        $meta['processed_by'] = 'ProcessMessageJob';
        $meta['uuid'] = (string) Str::uuid();

        $message->update([
            'message'      => $sanitized,
            'metadata'     => $meta,
            'processed_at' => now(),
        ]);

        broadcast(new MessageReceived($message))->toOthers();
    }
}
