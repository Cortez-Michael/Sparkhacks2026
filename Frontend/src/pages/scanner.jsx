import { useState, useCallback, useEffect } from "react";
import { Upload, Plus, Trash2, Check, Loader2 } from "lucide-react";

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
    const valid = items.filter((i) => (i.item || "").trim());
    if (valid.length === 0) {
      setError("Add at least one item with a name.");
      return;
    }
    setLoading(true);
    setError(null);
    setConfirmSuccess(null);
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
    <div style={{ padding: "1.5rem", paddingBottom: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.25rem",
          }}
        >
          Scan Receipt
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#666" }}>
          Upload a receipt image to extract items, edit the list, then add to
          your inventory.
        </p>
      </div>

      {/* Upload */}
      <div
        style={{
          border: "2px dashed #e5e7eb",
          borderRadius: "1rem",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1.5rem",
          backgroundColor: "#fafafa",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="receipt-upload"
        />
        <label
          htmlFor="receipt-upload"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <Upload style={{ width: "2rem", height: "2rem", color: "#8B7355" }} />
          <span style={{ fontSize: "0.875rem", color: "#666" }}>
            {imageFile ? imageFile.name : "Choose receipt image"}
          </span>
        </label>
        {imagePreview && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={imagePreview}
              alt="Receipt preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "0.5rem",
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}
      {confirmSuccess && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#f0fdf4",
            color: "#166534",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {confirmSuccess}
        </div>
      )}

      <button
        type="button"
        onClick={scanReceipt}
        disabled={!imageFile || loading}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: "0.75rem",
          border: "none",
          backgroundColor: imageFile && !loading ? "#8B7355" : "#d1d5db",
          color: "#fff",
          fontWeight: "600",
          fontSize: "0.875rem",
          cursor: imageFile && !loading ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {loading && !items.length ? (
          <>
            <Loader2
              style={{
                width: "1.25rem",
                height: "1.25rem",
                animation: "spin 1s linear infinite",
              }}
            />
            Scanning…
          </>
        ) : (
          "Scan receipt"
        )}
      </button>

      {/* Editable list */}
      {items.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Edit items
            </h3>
            <button
              type="button"
              onClick={addItem}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #8B7355",
                backgroundColor: "transparent",
                color: "#8B7355",
                fontSize: "0.8125rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <Plus style={{ width: "0.875rem", height: "0.875rem" }} />
              Add item
            </button>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((row, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <input
                  type="text"
                  value={row.item}
                  onChange={(e) => updateItem(index, "item", e.target.value)}
                  placeholder="Item name"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.875rem",
                  }}
                />
                <input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                  style={{
                    width: "4rem",
                    padding: "0.5rem 0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.875rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label="Remove item"
                  style={{
                    padding: "0.5rem",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#b91c1c",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 style={{ width: "1rem", height: "1rem" }} />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={confirmAndSend}
            disabled={loading}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "none",
              backgroundColor: loading ? "#d1d5db" : "#166534",
              color: "#fff",
              fontWeight: "600",
              fontSize: "0.875rem",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Saving…
              </>
            ) : (
              <>
                <Check style={{ width: "1.25rem", height: "1.25rem" }} />
                Confirm & add to inventory
              </>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
