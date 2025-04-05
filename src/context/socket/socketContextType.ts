import { seenMessageModel, sendMessageModel } from "@/src/api/features/messages/models/Messages";
import { Socket } from "socket.io-client";

export interface SocketContextType {
    socket: Socket | null;
  isConnected: boolean;
  sendMessage: (data: sendMessageModel) => void;
  seenMessage: (data: seenMessageModel) => void;
  newMessageTrigger: number;
}
