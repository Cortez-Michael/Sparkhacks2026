import { useState, useCallback, useEffect } from "react";
import { Upload, Plus, Trash2, Check, Loader2, Receipt, Sparkles } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function Scanner() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmSuccess, setConfirmSuccess] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    setError(null);
    setConfirmSuccess(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const scanReceipt = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    setConfirmSuccess(null);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch(`${API_BASE}/scan-receipt/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || data.error || "Failed to scan receipt");
        return;
      }
      const list = Array.isArray(data.items) ? data.items : [];
      setItems(
        list.map((i) => ({
          item: typeof i === "string" ? i : i.item || i.name || "",
          quantity:
            typeof i === "object" && i != null && "quantity" in i
              ? (i.quantity ?? 1)
              : 1,
        })),
      );
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      if (!next[index]) return next;
      if (field === "quantity") {
        const n = parseInt(value, 10);
        next[index].quantity = isNaN(n) ? 1 : Math.max(1, n);
      } else {
        next[index].item = value;
      }
      return next;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { item: "", quantity: 1 }]);
  };

  const confirmAndSend = async () => {
    // 1. Filter out empty items (This is correct)
    const valid = items.filter((i) => (i.item || "").trim());

    if (valid.length === 0) {
      setError("Add at least one item with a name.");
      return;
    }
    

    try {
      const res = await fetch(`${API_BASE}/send-list/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ items: valid }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || data.error || "Failed to save list");
        return;
      }
      setConfirmSuccess(data.message || `Added ${valid.length} item(s).`);
      setItems([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-page">
      <div className="scanner-container">
        {/* Header */}
        <header className="scanner-header">
          <div className="scanner-header-icon">
            <Receipt size={28} strokeWidth={1.8} />
          </div>
          <h1 className="scanner-title">Scan Receipt</h1>
          <p className="scanner-subtitle">
            Upload a receipt photo and we’ll pull out the items for you. Edit the list, then add to your inventory.
          </p>
        </header>

        {/* Upload zone */}
        <div className="upload-zone">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="upload-input"
            id="receipt-upload"
          />
          <label htmlFor="receipt-upload" className="upload-label">
            <div className="upload-icon-wrap">
              <Upload size={32} strokeWidth={1.6} />
            </div>
            <span className="upload-text">
              {imageFile ? imageFile.name : "Drop receipt image or click to browse"}
            </span>
            <span className="upload-hint">JPEG, PNG or WebP</span>
          </label>
          {imagePreview && (
            <div className="preview-wrap">
              <img src={imagePreview} alt="Receipt preview" className="preview-img" />
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        {confirmSuccess && (
          <div className="alert alert-success" role="status">
            <Check size={18} />
            {confirmSuccess}
          </div>
        )}

        {/* Scan button */}
        <button
          type="button"
          onClick={scanReceipt}
          disabled={!imageFile || loading}
          className="btn btn-scan"
        >
          {loading && !items.length ? (
            <>
              <Loader2 size={22} className="spin" />
              <span>Scanning receipt…</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Scan receipt</span>
            </>
          )}
        </button>

        {/* Editable list */}
        {items.length > 0 && (
          <section className="items-section">
            <div className="items-section-header">
              <h2 className="items-section-title">Edit items</h2>
              <button type="button" onClick={addItem} className="btn btn-add-item">
                <Plus size={18} />
                Add item
              </button>
            </div>
            <ul className="items-list">
              {items.map((row, index) => (
                <li key={index} className="item-row">
                  <input
                    type="text"
                    value={row.item}
                    onChange={(e) => updateItem(index, "item", e.target.value)}
                    placeholder="Item name"
                    className="item-input item-name"
                  />
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    className="item-input item-qty"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label="Remove item"
                    className="btn-remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={confirmAndSend}
              disabled={loading}
              className="btn btn-confirm"
            >
              {loading ? (
                <>
                  <Loader2 size={22} className="spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Check size={22} />
                  <span>Confirm & add to inventory</span>
                </>
              )}
            </button>
          </section>
        )}
      </div>

      <style>{`
        .scanner-page {
          min-height: calc(100vh - 4rem);
          padding: 2rem 1.25rem 3rem;
          background: linear-gradient(165deg, #1c1917 0%, #292524 45%, #1f1e1b 100%);
        }

        .scanner-container {
          max-width: 480px;
          margin: 0 auto;
        }

        .scanner-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .scanner-header-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.15));
          border: 1px solid rgba(251, 191, 36, 0.35);
          border-radius: 16px;
          color: #fbbf24;
        }

        .scanner-title {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #fafaf9;
          margin: 0 0 0.5rem;
        }

        .scanner-subtitle {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: #a8a29e;
          margin: 0;
          max-width: 36ch;
          margin-left: auto;
          margin-right: auto;
        }

        .upload-zone {
          background: rgba(41, 37, 36, 0.8);
          border: 2px dashed rgba(251, 191, 36, 0.4);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 1.25rem;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .upload-zone:hover {
          border-color: rgba(251, 191, 36, 0.6);
          background: rgba(41, 37, 36, 0.95);
          box-shadow: 0 0 0 1px rgba(251, 191, 36, 0.15);
        }

        .upload-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .upload-icon-wrap {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(251, 191, 36, 0.12);
          border-radius: 16px;
          color: #fbbf24;
          transition: transform 0.2s, background 0.2s;
        }

        .upload-label:hover .upload-icon-wrap {
          transform: scale(1.05);
          background: rgba(251, 191, 36, 0.2);
        }

        .upload-text {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #e7e5e4;
        }

        .upload-hint {
          font-size: 0.8125rem;
          color: #78716c;
        }

        .preview-wrap {
          margin-top: 1.25rem;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.3);
        }

        .preview-img {
          display: block;
          max-width: 100%;
          max-height: 220px;
          width: auto;
          height: auto;
          margin: 0 auto;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .alert-error {
          background: rgba(185, 28, 28, 0.2);
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(22, 101, 52, 0.2);
          border: 1px solid rgba(74, 222, 128, 0.35);
          color: #86efac;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 14px;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
        }

        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .btn:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-scan {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #1c1917;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4);
          margin-bottom: 0.5rem;
        }

        .btn-scan:not(:disabled):hover {
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.5);
        }

        .btn-scan:disabled {
          background: #44403c;
          color: #78716c;
          box-shadow: none;
        }

        .btn-add-item {
          width: auto;
          padding: 0.5rem 0.875rem;
          font-size: 0.8125rem;
          background: transparent;
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.5);
        }

        .btn-add-item:hover {
          background: rgba(251, 191, 36, 0.12);
        }

        .items-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .items-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .items-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e7e5e4;
          margin: 0;
        }

        .items-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(41, 37, 36, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          transition: border-color 0.2s, background 0.2s;
        }

        .item-row:focus-within {
          border-color: rgba(251, 191, 36, 0.4);
          background: rgba(41, 37, 36, 0.9);
        }

        .item-input {
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(28, 25, 23, 0.8);
          color: #fafaf9;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .item-input::placeholder {
          color: #78716c;
        }

        .item-input:focus {
          outline: none;
          border-color: rgba(251, 191, 36, 0.5);
        }

        .item-name {
          flex: 1;
          min-width: 0;
        }

        .item-qty {
          width: 4.5rem;
          text-align: center;
        }

        .item-qty::-webkit-inner-spin-button,
        .item-qty::-webkit-outer-spin-button {
          opacity: 1;
        }

        .btn-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          border: none;
          background: transparent;
          color: #a8a29e;
          border-radius: 8px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
        }

        .btn-remove:hover {
          color: #fca5a5;
          background: rgba(185, 28, 28, 0.2);
        }

        .btn-confirm {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
        }

        .btn-confirm:not(:disabled):hover {
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.45);
        }

        .btn-confirm:disabled {
          background: #44403c;
          color: #78716c;
          box-shadow: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 0.9s linear infinite;
        }
      `}</style>
    </div>
  );
}
