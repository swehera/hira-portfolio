"use client";
import { useState, useEffect, useCallback } from "react";
import { getSkills } from "../api";

export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSkills();
      setSkills(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    const handleFocus = () => fetchSkills();
    const handleUpdate = () => fetchSkills();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("portfolioUpdated", handleUpdate);
    // Poll every 30 seconds
    const poll = setInterval(fetchSkills, 30000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("portfolioUpdated", handleUpdate);
      clearInterval(poll);
    };
  }, [fetchSkills]);

  return { skills, setSkills, loading, error, refresh: fetchSkills };
}