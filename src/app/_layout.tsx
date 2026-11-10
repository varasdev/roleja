
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AppProvider>
    </PaperProvider>
  );
}
