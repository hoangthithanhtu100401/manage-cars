export const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const formatDate = (dateString: string): string => {
  return dateString;
};
export const formatDateYMD = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};
export const formatDateYMDH = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  return `${y}/${m}/${day} ${hours}:${minutes}`;
};
export function buildVehicleDateLabel(status: "IN" | "OUT", lastIn?: string, lastOut?: string) {
  const inLabel = lastIn ? `IN ${formatDateYMDH(lastIn)}` : "";
  const outLabel = lastOut ? `OUT ${formatDateYMDH(lastOut)}` : "";
  return status === "IN" ? inLabel : outLabel;
}
