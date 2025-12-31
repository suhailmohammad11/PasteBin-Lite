import React, { createContext, useContext, useState } from "react";

const PasteContext = createContext();
export const usePaste = () => useContext(PasteContext);

const BASE_URL = "http://localhost:4000"; // backend URL

export const PasteProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentPaste, setRecentPaste] = useState(null);

  // Create a new paste
  const createPaste = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Failed to create paste");
      }

      const result = JSON.parse(text);
      setRecentPaste(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch paste by ID
  const fetchPaste = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/pastes/${id}`);
      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Paste not found");
      }

      return JSON.parse(text);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearRecentPaste = () => setRecentPaste(null);

  return (
    <PasteContext.Provider
      value={{
        createPaste,
        fetchPaste,
        recentPaste,
        loading,
        error,
        clearError,
        clearRecentPaste,
      }}
    >
      {children}
    </PasteContext.Provider>
  );
};
