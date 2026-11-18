// ============================================================
// LAVSA — ChatPage
// Buyer-seller chat tied to a specific order.
// Accessed via /chat/:orderId
// Real-time bidirectional messaging powered by Socket.IO.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import AppLayout from '../../components/Layout/AppLayout';
import api from '../../services/api';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../../config/appConfig';
import { Button, Card, Badge, ErrorBanner, Spinner } from '../../components/UI/ui';
import {
  IconArrowLeft,
  IconMessageCircle,
} from '../../components/UI/Icons';

interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  created_at: string;
}

const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Today';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(iso);
}

const ChatPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [myId, setMyId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // ── Fetch current user ───────────────────────────────────────────────────
  useEffect(() => {
    api
      .get<{ user: { id: string; role: string } }>('/auth/me')
      .then((res) => {
        const u = (res.data as any)?.user || res.data;
        setMyId(u.id);
      })
      .catch(() => {});
  }, []);

  // ── Scroll to bottom on new messages ────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Initial fetch of message history ─────────────────────────────────────
  const fetchMessages = useCallback(() => {
    if (!orderId) return;
    setLoadingHistory(true);
    api
      .get<{ messages: ChatMessage[] }>(`/chat/${orderId}`)
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => setError('Could not load chat history.'))
      .finally(() => setLoadingHistory(false));
  }, [orderId]);

  // ── Real-time Socket.IO Connection ───────────────────────────────────────
  useEffect(() => {
    fetchMessages();

    if (!orderId) return;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : {},
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join_order', { orderId });
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('new_message', (incomingMsg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
    });

    socket.on('order_error', (err: { message?: string }) => {
      setError(err?.message || 'Access denied to this order conversation.');
    });

    return () => {
      socket.emit('leave_order', { orderId });
      socket.disconnect();
    };
  }, [fetchMessages, orderId]);

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !orderId || isSending) return;

    setIsSending(true);
    try {
      const res = await api.post<{ message: ChatMessage }>(`/chat/${orderId}`, { message: text });
      setNewMessage('');
      if (res.data?.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.data.message.id)) return prev;
          return [...prev, res.data.message];
        });
      }
    } catch {
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by day
  const grouped: { day: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const day = dayLabel(msg.created_at);
    if (grouped.length === 0 || grouped[grouped.length - 1].day !== day) {
      grouped.push({ day, msgs: [msg] });
    } else {
      grouped[grouped.length - 1].msgs.push(msg);
    }
  });

  return (
    <AppLayout>
      <div className="page chat-page" style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)' }}>
        {/* Header Card */}
        <Card
          padded
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            marginBottom: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px 8px' }}
              aria-label="Back"
            >
              <IconArrowLeft size={16} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                  Order Chat
                </h1>
                <Badge color="brand">#{orderId?.slice(0, 8).toUpperCase()}</Badge>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Coordinate meetup location and schedule on campus
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                color: socketConnected ? 'var(--success-strong)' : 'var(--text-faint)',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: socketConnected ? 'var(--success)' : 'var(--text-faint)',
                }}
              />
              {socketConnected ? 'Live' : 'Connecting'}
            </span>
          </div>
        </Card>

        {error && (
          <div style={{ marginBottom: 10, flexShrink: 0 }}>
            <ErrorBanner message={error} onRetry={() => setError('')} />
          </div>
        )}

        {/* Messages Body Card */}
        <Card
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--surface-soft)',
          }}
        >
          {loadingHistory && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Spinner size={24} />
            </div>
          )}

          {!loadingHistory && messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <IconMessageCircle size={24} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>No messages yet</div>
              <p style={{ fontSize: 13, margin: '4px 0 0', maxWidth: 280 }}>
                Say hello to coordinate campus handoff details!
              </p>
            </div>
          )}

          {grouped.map(({ day, msgs }) => (
            <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Day divider */}
              <div style={{ textAlign: 'center', margin: '4px 0' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {day}
                </span>
              </div>

              {msgs.map((m) => {
                const isMe = myId ? m.sender_id === myId : false;

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!isMe && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          marginBottom: 3,
                          paddingLeft: 4,
                        }}
                      >
                        {m.sender_name || 'Campus Peer'}
                      </span>
                    )}

                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: isMe ? 'var(--brand)' : 'var(--surface)',
                        color: isMe ? '#ffffff' : 'var(--ink)',
                        border: isMe ? 'none' : '1px solid var(--border)',
                        boxShadow: 'var(--shadow-xs)',
                        wordBreak: 'break-word',
                        fontSize: 14,
                        lineHeight: 1.45,
                      }}
                    >
                      {m.message}
                    </div>

                    <span
                      style={{
                        fontSize: 10,
                        color: 'var(--text-faint)',
                        marginTop: 3,
                        padding: '0 4px',
                      }}
                    >
                      {formatTime(m.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={bottomRef} />
        </Card>

        {/* Input Bar Card */}
        <Card
          padded
          style={{
            marginTop: 10,
            padding: '10px 14px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="input"
            style={{
              flex: 1,
              resize: 'none',
              padding: '10px 12px',
              height: 42,
              maxHeight: 100,
              fontSize: 14,
              border: 'none',
              background: 'var(--surface-soft)',
            }}
          />

          <Button
            variant="primary"
            size="md"
            icon="send"
            disabled={!newMessage.trim() || isSending}
            loading={isSending}
            onClick={handleSend}
            id="chat-send-btn"
          >
            Send
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
