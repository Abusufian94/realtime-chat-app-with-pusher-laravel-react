import React, {
    FormEvent,
    useEffect,
    useRef,
    useState,
    UIEvent,
} from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { dashboard, messages as messagesRoute } from '@/routes';
type Message = {
    id: number;
    sender_id: number;
    sender_name: string;
    message: string;
    processed_at?: string | null;
    created_at: string;
};

type PageProps = {
    messages: Message[];
    user: { id: number; name: string; email: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Messages',
        href: messagesRoute().url,
    },
];


export default function MessagesIndex() {
    

    const { props } = usePage<PageProps>();
    const currentUser = props.user;

    const [messages, setMessages] = useState<Message[]>(props.messages || []);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    
    // read state: which messages are "read" in this client
    const [readIds, setReadIds] = useState<Set<number>>(
        () =>
            new Set(
                (props.messages || []).map((m) => m.id)
            ) // initial messages considered read
    );

    const [unreadCount, setUnreadCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const listRef = useRef<HTMLDivElement | null>(null);

    // preload sound
// preload sound
const soundRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
    const audio = new Audio(`${window.location.origin}/sounds/message.mp3`);
    audio.preload = 'auto';
    soundRef.current = audio;

    console.log('Audio loaded with src:', audio.src);

    const unlockAudio = () => {
        if (!soundRef.current) return;

        soundRef.current
            .play()
            .then(() => {
                soundRef.current!.pause();
                soundRef.current!.currentTime = 0;
                window.removeEventListener('click', unlockAudio);
                console.log('Audio unlocked by user interaction');
            })
            .catch((err) => {
                console.error('Unlock audio error:', err);
            });
    };

    window.addEventListener('click', unlockAudio);

    return () => window.removeEventListener('click', unlockAudio);
}, []);



    
    // scroll to bottom helper
    const scrollToBottom = () => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    };

    // Mark all messages as read
    const markAllAsRead = () => {
        setReadIds(new Set(messages.map((m) => m.id)));
        setUnreadCount(0);
    };

    // When component mounts, scroll to bottom & mark read
    useEffect(() => {
        scrollToBottom();
        markAllAsRead();
    }, []);

    // Listen to websocket events
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel('messages.channel');

        channel.listen('.message.received', (e: any) => {
            const msg: Message = {
                id: e.id,
                sender_id: e.sender_id,
                sender_name: e.sender_name,
                message: e.message,
                processed_at: e.processed_at,
                created_at: e.created_at,
            };

            setMessages((prev) => [...prev, msg]);

            const isIncoming = e.sender_id !== currentUser.id;

            // play sound on incoming message
            if (isIncoming && soundRef.current) {
                 soundRef.current.currentTime = 0;
                soundRef.current.play().catch(() => {});
            }

            // read/unread logic
            setReadIds((prev) => {
                const next = new Set(prev);

                if (isAtBottom) {
                    // If user is at bottom, we consider it read immediately
                    next.add(msg.id);
                } else if (isIncoming) {
                    // Incoming & user not at bottom -> unread
                    // leave it unread; we'll mark on scroll
                }

                return next;
            });

            setUnreadCount((prevCount) => {
                if (isAtBottom) return 0;
                return isIncoming ? prevCount + 1 : prevCount;
            });

            // If user is at bottom, keep it scrolled down
            if (isAtBottom) {
                setTimeout(scrollToBottom, 50);
            }
        });

        return () => {
            channel.stopListening('.message.received');
        };
    }, [currentUser.id, isAtBottom]);

    // Scroll handler to detect "at bottom" and mark read
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const threshold = 20; // px
        const atBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

        setIsAtBottom(atBottom);

        if (atBottom) {
            // Mark all messages as read when user scrolls to bottom
            markAllAsRead();
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setSending(true);

        try {
            await axios.post('/api/messages', {
                sender_id: currentUser.id,
                message: text,
            });

            setText('');
        } catch (error) {
            console.error(error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    // Human-readable time
    const formatTime = (iso: string) => {
        const d = new Date(iso);

        return d.toLocaleString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
        });
    };

    // Tick icons for read/unread
    const renderTicks = (message: Message) => {
        // Only show ticks for messages sent by current user (like WhatsApp)
        if (message.sender_id !== currentUser.id) return null;

        const isRead = readIds.has(message.id);

        return (
            <span
                className={`ml-1 text-[10px] ${
                    isRead ? 'text-blue-400' : 'text-gray-400'
                }`}
            >
                {isRead ? '✓✓' : '✓'}
            </span>
        );
    };

    return (
        <AppLayout  breadcrumbs={breadcrumbs}>
        <Head title="Real-Time Messages" />
           
            {/* Toast for unread messages */}
            {unreadCount > 0 && (
                <div className="fixed right-4 top-16 z-30">
                    <button
                        onClick={() => {
                            scrollToBottom();
                            markAllAsRead();
                        }}
                        className="rounded-lg bg-gray-900/90 px-4 py-2 text-xs text-white shadow-lg border border-gray-700"
                    >
                        New messages ({unreadCount}) – click to view
                    </button>
                </div>
            )}

            <div className="mx-auto flex h-[calc(100vh-80px)] max-w-xl flex-col py-4">
                <h1 className="mb-2 text-lg font-semibold">
                    Chat as {currentUser.name}
                </h1>

                {/* Messages list */}
                <div
                    ref={listRef}
                    onScroll={handleScroll}
                    className="flex-1 space-y-2 overflow-y-auto rounded-lg border bg-slate-900/40 p-3"
                >
                    {messages.length === 0 && (
                        <p className="text-center text-sm text-gray-400">
                            No messages yet. Say hi 👋
                        </p>
                    )}

                    {messages.map((m) => {
                        const isMine = m.sender_id === currentUser.id;

                        return (
                            <div
                                key={m.id}
                                className={`flex ${
                                    isMine
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow ${
                                        isMine
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-700 text-white rounded-bl-none'
                                    }`}
                                >
                                    <div className="mb-1 text-[11px] opacity-70">
                                        {isMine ? 'You' : m.sender_name}
                                    </div>

                                    <div>{m.message}</div>

                                    <div className="mt-1 flex items-center justify-end text-[10px] opacity-80">
                                        <span>{formatTime(m.created_at)}</span>
                                        {renderTicks(m)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input area */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-3 flex gap-2 border-t border-gray-700 pt-3"
                >
                    <input
                        className="flex-1 rounded-full border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        disabled={sending}
                        className="rounded-full border border-blue-500 px-4 py-2 text-sm text-blue-100 hover:bg-blue-600/80 hover:text-white disabled:opacity-50"
                    >
                        {sending ? 'Sending…' : 'Send'}
                    </button>
                </form>
            </div>
       </AppLayout>
    );
}
