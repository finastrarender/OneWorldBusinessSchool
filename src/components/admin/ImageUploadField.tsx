"use client";

import { useId, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  name?: string;
  placeholder?: string;
};

const PREFERRED_IMAGE_EXTENSIONS = new Set(["webp", "avif"]);

function getImageExtension(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "";
  const parts = normalized.split(".");
  const extension = parts.at(-1)?.toLowerCase();

  return extension && extension.length > 0 ? extension : null;
}

function shouldShowModernFormatWarning(value: string) {
  const extension = getImageExtension(value);

  if (!extension) return false;

  return !PREFERRED_IMAGE_EXTENSIONS.has(extension);
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  name,
  placeholder,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputId = useId();
  const showModernFormatWarning = shouldShowModernFormatWarning(value);

  async function requestPresign(file: File) {
    const payload = {
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      folder,
    };

    const endpoints = ["/api/v1/admin/uploads/presign", "/api/admin/uploads/presign"];
    let lastError = "Failed to prepare upload";

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (response.status === 404) {
        lastError = `Upload endpoint not found: ${endpoint}`;
        continue;
      }

      if (!contentType.includes("application/json")) {
        const bodyText = await response.text();
        throw new Error(
          `Upload API returned unexpected response (${response.status}): ${bodyText.slice(0, 180)}`,
        );
      }

      const json = (await response.json()) as {
        data?: { uploadUrl?: string; assetUrl?: string };
        error?: { message?: string };
      };

      if (!response.ok) {
        throw new Error(json?.error?.message ?? `Failed to prepare upload (${response.status})`);
      }

      return json;
    }

    throw new Error(lastError);
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const presignJson = await requestPresign(file);

      const uploadUrl = String(presignJson?.data?.uploadUrl ?? "");
      const assetUrl = String(presignJson?.data?.assetUrl ?? "");
      if (!uploadUrl || !assetUrl) {
        throw new Error("Upload API response is missing upload URL");
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error("Upload to S3 failed");
      }

      const uploadedAssetUrl = assetUrl;
      const cacheBustedAssetUrl = uploadedAssetUrl
        ? `${uploadedAssetUrl}${uploadedAssetUrl.includes("?") ? "&" : "?"}v=${Date.now()}`
        : uploadedAssetUrl;
      onChange(cacheBustedAssetUrl);
      setMessage("Image uploaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label htmlFor={inputId}>
        {label}
        <input
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </label>

      <label style={{ display: "grid", gap: 4 }}>
        <span>Upload image</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            void handleFileChange(e.target.files?.[0] ?? null);
            e.currentTarget.value = "";
          }}
          disabled={uploading}
        />
      </label>

      {value ? (
        <div style={{ display: "grid", gap: 8 }}>
          <img
            src={value}
            alt=""
            width={240}
            height={240}
            style={{ width: 240, maxWidth: "100%", borderRadius: 12, border: "1px solid #e2e8f0" }}
          />
          <p className="admin-muted" style={{ margin: 0, wordBreak: "break-all" }}>
            {value}
          </p>
        </div>
      ) : null}

      {message ? (
        <p className={message === "Image uploaded." ? "contact-form__ok" : "contact-form__err"}>
          {message}
        </p>
      ) : null}

      {showModernFormatWarning ? (
        <p
          className="admin-muted"
          style={{
            margin: 0,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #f59e0b",
            background: "#fffbeb",
            color: "#92400e",
          }}
        >
          For better web performance, use a `webp` or `avif` image when possible.
        </p>
      ) : null}
    </div>
  );
}
