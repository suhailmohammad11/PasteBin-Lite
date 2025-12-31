import "./CreatePasteStyles.css";
import { usePaste } from "../../Context/PasteContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePaste = () => {
  const { createPaste, loading, error, clearError } = usePaste();
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const pasteData = {
      content,
      ...(ttlSeconds > 0 && { ttl_seconds: Number(ttlSeconds) }),
      ...(maxViews > 0 && { max_views: Number(maxViews) }),
    };

    try {
      const result = await createPaste(pasteData);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");

      navigate(`/p/${result.id}`);
    } catch (err) {
      console.error("Create paste error:", err.message);
    }
  };

  return (
    <div className="create-paste">
      <form onSubmit={handleSubmit} className="paste-form">
        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Paste your text here..."
            rows="10"
          />
        </div>

        <div className="constraints">
          <div className="form-group">
            <label>Expire After (seconds)</label>
            <input
              type="number"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              min="1"
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Maximum Views</label>
            <input
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              min="1"
              placeholder="Optional"
            />
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreatePaste;
