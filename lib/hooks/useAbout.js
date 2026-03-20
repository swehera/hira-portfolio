"use client";
import { useState, useEffect, useCallback } from "react";
import { getAbout } from "../api";

export function useAbout() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAbout();
      setAbout(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  useEffect(() => {
    const handleFocus = () => fetchAbout();
    const handleUpdate = () => fetchAbout();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("portfolioUpdated", handleUpdate);
    // Poll every 30 seconds — not 5 (5s caused 429 rate limit errors)
    const poll = setInterval(fetchAbout, 30000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("portfolioUpdated", handleUpdate);
      clearInterval(poll);
    };
  }, [fetchAbout]);

  return { about, loading, error, refresh: fetchAbout };
}