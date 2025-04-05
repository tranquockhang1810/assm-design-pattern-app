import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContextType } from "./socketContextType";
import { useAuth } from "../auth/useAuth";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import messaging from '@react-native-firebase/messaging';

const SOCKET_URL = process.env.EXPO_PUBLIC_SERVER_ENDPOINT;
const SocketIoContext = createContext<SocketContextType | undefined>(undefined);

export const SocketIoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [newMessageTrigger, setNewMessageTrigger] = useState<number>(0);
    const getFcmToken = async () => {
        try {
          const token = await messaging().getToken();
          return token;
        } catch (error) {
          console.error('Failed to get FCM token:', error);
          return null;
        }
      };
    
      const requestNotificationPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (!enabled) {
          Alert.alert("Thông báo", "Bạn cần bật quyền thông báo để nhận tin nhắn.");
          return false;
        }
    
        // Android 13+ cần thêm POST_NOTIFICATIONS
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Thông báo", "Bạn cần cho phép thông báo để nhận tin nhắn.");
            return false;
          }
        }
    
        return true;
      };
    
      const sendMessage = (message: any) => {
        if (socket && isConnected) {
            socket.emit("send-message", message);
            }
        }

    const seenMessage = (message: any) => {
        if (socket && isConnected) {    
            socket.emit("seen-chat", message);
            
        }
    }
    
    useEffect(() => {
        if (!user?._id) return;

        const connectSocket = async () => {
          const hasPermission = await requestNotificationPermission();
          if (!hasPermission) return;
    
          const fcmToken = await getFcmToken();
          if (!fcmToken) return;
    
          const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    
          newSocket.on("connect", () => {
            console.log("✅ Connected to socket");
            setIsConnected(true);
            newSocket.emit("user-online", {
              userId: user._id,
              fcmToken,
            });
          });
    
          newSocket.on("disconnect", () => {
            console.log("❌ Disconnected from socket");
            setIsConnected(false);
          });
    
          newSocket.on("receive-message", (data: any) => {
            console.log("📩 Message received:", data);
            setNewMessageTrigger((prev) => prev + 1);
          });
    
          newSocket.on("socket-error", (data: { error?: { code?: number, message?: string } }) => {
            console.error("🚨 Socket Error:", data?.error?.message);
            Alert.alert("Error", data?.error?.message);
          });
    
          setSocket(newSocket);
        };
    
        connectSocket();
    
        return () => {
          if (socket) socket.disconnect();
        };
      }, [user?._id]);
    
    return (
        <SocketIoContext.Provider value={{socket, isConnected, sendMessage, seenMessage, newMessageTrigger}}>
        {children}
        </SocketIoContext.Provider>
    );
    };

    export const useSocket = (): SocketContextType => {
        const context = useContext(SocketIoContext);
        if (context === undefined) {
            throw new Error("useSocket must be used within a SocketIoProvider");
        }
        return context;
    }