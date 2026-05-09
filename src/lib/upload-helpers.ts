export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function deriveDisplayName(text: string, files: File[]): string {
  if (files.length > 0) {
    const first = files[0].name;
    const base = first.replace(/\.[^.]+$/, "").trim() || first;
    if (files.length === 1) return base;
    return `${base} + ${files.length - 1} more`;
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) return "Untitled case";
  const firstLine = trimmed.split(/\n|\.|!|\?/)[0].trim();
  const candidate = firstLine.length > 0 ? firstLine : trimmed;
  if (candidate.length <= 48) return candidate;
  return `${candidate.slice(0, 48).trimEnd()}…`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
