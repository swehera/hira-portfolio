"use client";
import { useState, useEffect, useCallback } from "react";
import { getContact } from "../api";

export function useContact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContact = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getContact();
      setContact(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  useEffect(() => {
    const handleFocus = () => fetchContact();
    const handleUpdate = () => fetchContact();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("portfolioUpdated", handleUpdate);
    // Poll every 30 seconds
    const poll = setInterval(fetchContact, 30000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("portfolioUpdated", handleUpdate);
      clearInterval(poll);
    };
  }, [fetchContact]);

  return { contact, setContact, loading, error, refresh: fetchContact };
}