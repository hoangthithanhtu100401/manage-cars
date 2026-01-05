import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/authService";
import { clearToken } from "@/services/token";

function isExpired(expiration?: string | number | null) {
  if (!expiration) return false; 
  const expMs =
    typeof expiration === "number"
      ? expiration
      : new Date(expiration).getTime();

  return expMs <= Date.now();
}

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const auth = await authService.getAuth();

        const token = auth?.token;
        const expired = isExpired(auth?.expiration);

        if (token && !expired) {
          router.replace("/(tabs)/search");
          return;
        }

        await authService.clearAuth();
        await clearToken();

        router.replace("/login");
      } catch (e) {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return null;
}
