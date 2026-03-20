"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getMessages,
  getMessageStats,
  markMessageRead,
  markMessageStarred,
  markAllMessagesRead,
  deleteMessage,
} from "../api";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, starred: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const [msgRes, statRes] = await Promise.all([
        getMessages(filter),
        getMessageStats(),
      ]);
      setMessages(msgRes.data || []);
      setStats(statRes.data || { total: 0, unread: 0, starred: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleRead = async (id, is_read) => {
    try {
      await markMessageRead(id, is_read);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read } : m))
      );
      setStats((s) => ({
        ...s,
        unread: is_read ? s.unread - 1 : s.unread + 1,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStar = async (id, is_starred) => {
    try {
      await markMessageStarred(id, is_starred);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_starred } : m))
      );
      setStats((s) => ({
        ...s,
        starred: is_starred ? s.starred + 1 : s.starred - 1,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllMessagesRead();
      setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
      setStats((s) => ({ ...s, unread: 0 }));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeMessage = async (id) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setStats((s) => ({ ...s, total: s.total - 1 }));
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    messages,
    stats,
    loading,
    error,
    filter,
    setFilter,
    toggleRead,
    toggleStar,
    markAllRead,
    removeMessage,
    refresh: fetchMessages,
  };
}
