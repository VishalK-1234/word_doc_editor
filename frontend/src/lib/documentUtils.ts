
export async function sendEditsToBackend(
  file: File,
  textMap: Record<string, string>
): Promise<Blob> {
  if (!file) {
    throw new Error("Original DOCX file is missing");
  }

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("text_map", JSON.stringify(textMap));

  const response = await fetch(`${API_BASE}/edit-docx`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return await response.blob();
}
