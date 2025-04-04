import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContextType } from "./socketContextType";

const SocketIoContext = createContext<SocketContextType | undefined>(undefined);

export const SocketIoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    
    useEffect(() => {
        const newSocket = io(process.env.EXPO_PUBLIC_SERVER_ENDPOINT! || "http://localhost:8000", {
          transports: ["websocket"], 
          reconnection: true,
        });
        newSocket.on("connect", () => {
          console.log("Connected to WebSocket server");
          setIsConnected(true);
        });
    
        newSocket.on("disconnect", () => {
          console.log("Disconnected from server");
          setIsConnected(false);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Connection error:", error.message);
            setIsConnected(false);
          });
      
          setSocket(newSocket);
      
          // Cleanup khi component unmount
          return () => {
            console.log("Cleaning up socket connection...");
            newSocket.disconnect();
          };
        }, []);
    
      // Gửi sự kiện user online
      const setUserOnline = (userId: string) => {
        if (socket) {
          socket.emit("user-online", { userId });
        }
      };
    
    return (
        <SocketIoContext.Provider value={{socket, isConnected,setUserOnline }}>
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