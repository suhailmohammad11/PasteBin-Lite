import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePaste } from "../../Context/PasteContext";
import "./ViewPasteStyles.css";

const ViewPaste = () => {
  const { id } = useParams();
  const { fetchPaste, loading, clearError } = usePaste();

  const [paste, setPaste] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id || hasFetched.current) return;

    hasFetched.current = true;
    clearError();

    const loadPaste = async () => {
      try {
        const data = await fetchPaste(id);
        setPaste(data);
      } catch {
        setNotFound(true);
      }
    };

    loadPaste();
  }, [id, fetchPaste, clearError]);

  if (loading) return <div className="loading">Loading...</div>;

  if (notFound) return <div className="not-found">Paste not found</div>;

  if (!paste) return null;

  return (
    <div className="view-paste">
      <div className="paste-info">
        <span>
          Views remaining:{" "}
          {paste.remaining_views !== null ? paste.remaining_views : "Unlimited"}
        </span>
        <span>
          Expires at:{" "}
          {paste.expires_at
            ? new Date(paste.expires_at).toLocaleString("en-IN")
            : "Never"}
        </span>
      </div>

      <pre className="paste-content">{paste.content}</pre>
    </div>
  );
};

export default ViewPaste;
