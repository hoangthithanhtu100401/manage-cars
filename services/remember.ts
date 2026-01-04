import * as SecureStore from "expo-secure-store";

const KEY_REMEMBER = "remember_enabled";
const KEY_USERNAME = "remember_username";
const KEY_PASSWORD = "remember_password";

export async function setRememberEnabled(enabled: boolean) {
  await SecureStore.setItemAsync(KEY_REMEMBER, enabled ? "1" : "0");
}

export async function getRememberEnabled() {
  const v = await SecureStore.getItemAsync(KEY_REMEMBER);
  return v === "1";
}

export async function saveRememberAccount(username: string, password: string) {
  await SecureStore.setItemAsync(KEY_USERNAME, username);
  await SecureStore.setItemAsync(KEY_PASSWORD, password);
}

export async function loadRememberAccount() {
  const username = (await SecureStore.getItemAsync(KEY_USERNAME)) || "";
  const password = (await SecureStore.getItemAsync(KEY_PASSWORD)) || "";
  return { username, password };
}

export async function clearRememberAccount() {
  await SecureStore.deleteItemAsync(KEY_USERNAME);
  await SecureStore.deleteItemAsync(KEY_PASSWORD);
  await SecureStore.setItemAsync(KEY_REMEMBER, "0");
}
