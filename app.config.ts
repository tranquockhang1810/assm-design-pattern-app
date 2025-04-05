import { ExpoConfig, ConfigContext } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "chat-app-client",
  slug: "chat-app-client",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/adaptive-icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    googleServicesFile: "./GoogleService-Info.plist",
    bundleIdentifier: "com.company.appchat"
  },
  android: {
    googleServicesFile: "./google-services.json",
    package: "com.company.appchat",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    jsEngine: "hermes",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      }
    ],
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        }
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: "108c6501-b3b7-4ecf-a9b1-ba1131dff7c6"
    }
  },
  
});
