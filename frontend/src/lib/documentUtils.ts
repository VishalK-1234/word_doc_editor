// src/lib/documentUtils.ts

/**
 * IMPORTANT:
 * This file NO LONGER parses, generates, or reconstructs DOCX files.
 * The original .docx is the single source of truth.
 * All formatting is preserved by delegating document mutation to the backend.
 */

const BACKEND_URL = "http://localhost:8000/edit-docx";

/**
 * Sends the original DOCX and text replacements to the backend.
 * The backend edits ONLY text nodes and returns a modified DOCX.
 *
 * @param file Original uploaded .docx file
 * @param textMap Mapping of original text -> edited text
 * @returns Blob of edited .docx
 */
export async function sendEditsToBackend(
  file: File,
  textMap: Record<string, string>
): Promise<Blob> {
  if (!file) {
    throw new Error("Original DOCX file is missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("text_map", JSON.stringify(textMap));

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return await response.blob();
}
