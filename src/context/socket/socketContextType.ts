import { sendMessageModel } from "@/src/api/features/messages/models/Messages";
import { Socket } from "socket.io-client";

export interface SocketContextType {
    socket: Socket | null;
  isConnected: boolean;
  setUserOnline: (userId: string) => void;
}
