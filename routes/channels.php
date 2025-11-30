<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('messages.channel', function () {
    return true; // public – everyone connected will receive updates
});
