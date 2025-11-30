import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo?: Echo<any>;
        Pusher?: typeof Pusher;
    }
}

const env = import.meta.env as any;

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: env.VITE_PUSHER_APP_KEY,
    cluster: env.VITE_PUSHER_APP_CLUSTER ?? 'ap2',
    forceTLS: true,        // use HTTPS/WSS to Pusher cloud
});

export default window.Echo;
