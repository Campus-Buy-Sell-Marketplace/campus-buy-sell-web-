// ============================================================
// LAVSA — ChatPage
// Buyer-seller chat tied to a specific order.
// Accessed via /chat/:orderId
// Polls every 4 s for new messages (simple, no WebSocket needed).
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import api from '../../services/api';

interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  created_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(iso);
}

// ── Component ─────────────────────────────────────────────────────────────────

const ChatPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [myId, setMyId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ── Fetch current user ───────────────────────────────────────────────────
  useEffect(() => {
    api.get<{ user: { id: string; role: string } }>('/auth/me').then((res) => {
      const u = (res.data as any)?.user || res.data;
      setMyId(u.id);
    });
  }, []);

  // ── Scroll to bottom on new messages ────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Fetch messages ───────────────────────────────────────────────────────
  const fetchMessages = useCallback(() => {
    if (!orderId) return;
    api
      .get<{ messages: ChatMessage[] }>(`/chat/${orderId}`)
      .then((res) => setMessages(res.data.messages))
      .catch(() => {});
  }, [orderId]);

  useEffect(() => {
    fetchMessages();
    // Poll every 4 seconds for new messages
    pollingRef.current = setInterval(fetchMessages, 4000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchMessages]);

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !orderId) return;

    setIsSending(true);
    try {
      await api.post(`/chat/${orderId}`, { message: text });
      setNewMessage('');
      fetchMessages();
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

  // ── Group messages by day ─────────────────────────────────────────────────
  const grouped: { day: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const day = dayLabel(msg.created_at);
    if (grouped.length === 0 || grouped[grouped.length - 1].day !== day) {
      grouped.push({ day, msgs: [msg] });
    } else {
      grouped[grouped.length - 1].msgs.push(msg);
    }
  });

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    page: {
      maxWidth: '720px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      height: 'calc(100vh - 120px)',
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 0 12px',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '0',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      color: '#6366f1',
      padding: '4px 8px',
      borderRadius: '8px',
      transition: 'background 0.15s',
    },
    title: {
      flex: 1,
      margin: 0,
      fontSize: '18px',
      fontWeight: 700,
      color: '#1e293b',
    },
    orderId: {
      fontSize: '12px',
      color: '#94a3b8',
      fontFamily: 'monospace',
    },
    chatBody: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px 4px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    dayBadge: {
      textAlign: 'center' as const,
      margin: '12px 0 4px',
      fontSize: '11px',
      fontWeight: 600,
      color: '#94a3b8',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    bubble: (isMine: boolean): React.CSSProperties => ({
      alignSelf: isMine ? 'flex-end' : 'flex-start',
      maxWidth: '75%',
      background: isMine ? '#6366f1' : '#f1f5f9',
      color: isMine ? '#fff' : '#1e293b',
      borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      padding: '10px 14px',
      fontSize: '14px',
      lineHeight: 1.5,
      boxShadow: isMine
        ? '0 2px 8px rgba(99,102,241,0.25)'
        : '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '2px',
    }),
    bubbleMeta: (isMine: boolean): React.CSSProperties => ({
      fontSize: '11px',
      color: isMine ? '#c7d2fe' : '#94a3b8',
      marginTop: '4px',
      textAlign: isMine ? 'right' : 'left',
    }),
    senderName: {
      fontWeight: 600,
      marginBottom: '2px',
      fontSize: '12px',
      color: '#6366f1',
    },
    inputRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      padding: '12px 0 8px',
      borderTop: '1px solid #e2e8f0',
    },
    textarea: {
      flex: 1,
      resize: 'none' as const,
      border: '1.5px solid #e2e8f0',
      borderRadius: '14px',
      padding: '10px 14px',
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
      outline: 'none',
      lineHeight: 1.5,
      maxHeight: '120px',
      minHeight: '44px',
      background: '#f8fafc',
      transition: 'border-color 0.15s',
      color: '#1e293b',
    },
    sendBtn: {
      background: '#6366f1',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '14px',
      height: '44px',
      whiteSpace: 'nowrap' as const,
      transition: 'background 0.15s, transform 0.1s',
      flexShrink: 0,
    },
    empty: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      gap: '8px',
    },
    errorBanner: {
      background: '#fef2f2',
      color: '#991b1b',
      padding: '8px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      marginBottom: '8px',
      textAlign: 'center' as const,
    },
  };

  return (
    <AppLayout>
      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate(-1)} title="Go back">
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={s.title}>Order Chat</h1>
            <div style={s.orderId}>Order #{orderId?.slice(0, 8).toUpperCase()}</div>
          </div>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
            }}
            title="Live"
          />
        </div>

        {error && <div style={s.errorBanner}>{error}</div>}

        {/* Chat body */}
        <div style={s.chatBody}>
          {grouped.length === 0 ? (
            <div style={s.empty}>
              <span style={{ fontSize: '40px' }}>💬</span>
              <p style={{ fontWeight: 600 }}>No messages yet</p>
              <p style={{ fontSize: '13px' }}>Say hi to coordinate your meetup!</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.day}>
                <div style={s.dayBadge}>{group.day}</div>
                {group.msgs.map((msg) => {
                  const isMine = msg.sender_id === myId;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start',
                        marginBottom: '6px',
                      }}
                    >
                      {!isMine && (
                        <div style={s.senderName}>
                          {msg.sender_name}{' '}
                          <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '11px' }}>
                            ({msg.sender_role})
                          </span>
                        </div>
                      )}
                      <div style={s.bubble(isMine)}>{msg.message}</div>
                      <div style={s.bubbleMeta(isMine)}>{formatTime(msg.created_at)}</div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div style={s.inputRow}>
          <textarea
            ref={inputRef}
            style={s.textarea}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={1000}
          />
          <button
            id="chat-send-btn"
            style={{
              ...s.sendBtn,
              opacity: isSending || !newMessage.trim() ? 0.6 : 1,
              cursor: isSending || !newMessage.trim() ? 'not-allowed' : 'pointer',
            }}
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
