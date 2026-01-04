import * as SecureStore from "expo-secure-store";

const USER_ID_KEY = "AUTH_USER_ID";

export async function setUserId(userId: number) {
  await SecureStore.setItemAsync(USER_ID_KEY, String(userId));
}

export async function getUserId(): Promise<number | null> {
  const v = await SecureStore.getItemAsync(USER_ID_KEY);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function clearUserId() {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
}
