// Deterministic placeholder image per case_id. The backend may attach a real
// `cover_image_url` to the CaseSummary in the future; when present we honor
// that, otherwise we seed a Picsum URL so each case gets a stable, distinct
// image without external API keys.
export function coverImageFor(caseId: number, override?: string): string {
  if (override && override.length > 0) return override;
  return `https://picsum.photos/seed/thewire-${caseId}/640/360`;
}
