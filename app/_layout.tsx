import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        {/* IMPORTANT: add these */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />

        {/* existing */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/detail" />
        <Stack.Screen name="screens/edit" />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
