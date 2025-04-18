import { Provider } from "@ant-design/react-native";
import { Stack } from "expo-router";
import { Platform, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import useColor from "@/src/hooks/useColor";
import { AuthProvider } from "@/src/context/auth/useAuth";
import { SocketIoProvider } from "@/src/context/socket/useSocket";

export default function RootLayout() {
  const screens = ["index", "login", "signUp", "forgotPassword", "(tabs)"];

  const { brandPrimary, brandPrimaryTap, backgroundColor } = useColor();

  return (
    <AuthProvider>
      <SocketIoProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ActionSheetProvider>
          <View
            style={{
              flex: 1,
              backgroundColor: backgroundColor,
            }}
          >
            <Provider
              theme={{
                primary_button_fill: brandPrimary,
                primary_button_fill_tap: brandPrimaryTap,
                ghost_button_color: brandPrimary,
                ghost_button_fill_tap: brandPrimaryTap,
                brand_primary: brandPrimary,
                prefix_padding: 0,
              }}
            >
              <StatusBar
                backgroundColor={"transparent"}
                barStyle={"dark-content"}
              />
              <Stack screenOptions={{ headerShown: false }}>
                {screens?.map((screen, index) => (
                  <Stack.Screen key={index} name={screen} />
                ))}
              </Stack>
            </Provider>
          </View>
        </ActionSheetProvider>
      </GestureHandlerRootView>
      </SocketIoProvider>
    </AuthProvider>
  );
}
