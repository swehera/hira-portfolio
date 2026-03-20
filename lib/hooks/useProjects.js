"use client";
import { useState, useEffect, useCallback } from "react";
import { getProjects } from "../api";

export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjects(featuredOnly);
      setProjects(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [featuredOnly]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const handleFocus = () => fetchProjects();
    const handleUpdate = () => fetchProjects();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("portfolioUpdated", handleUpdate);
    // Poll every 30 seconds
    const poll = setInterval(fetchProjects, 30000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("portfolioUpdated", handleUpdate);
      clearInterval(poll);
    };
  }, [fetchProjects]);

  return { projects, setProjects, loading, error, refresh: fetchProjects };
}