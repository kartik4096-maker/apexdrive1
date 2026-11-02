const KEY = "apexdrive_client_id";

export function getClientId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "c_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}