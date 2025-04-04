import { ChatModel } from "./Chat";

export interface CreateMessageModel {
  chatId?: string;
  sender?: string;
  receiver?: string;
}


export interface MessageModel {
 _id?: string;
 chatId?: string;
 sender?: string;
 type?: string;
  content?: string;
  createdAt?: string;
}

export interface GetMessagesModel {
  userId?: string;
  limit?: number;
  page?: number;
}

export interface GetMessagesModelResponse {
  Chat ?: ChatModel;
  Messages?: MessageModel[];
}