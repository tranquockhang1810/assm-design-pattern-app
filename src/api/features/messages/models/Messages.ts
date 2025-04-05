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
  images?: string[];
}

export interface GetMessagesModel {
  userId?: string;
  limit?: number;
  page?: number;
}

export interface GetMessagesModelResponse {
  chat?: ChatModel;
  messages?: MessageModel[];
}

export interface sendMessageModel {
  chatId?: string;
  sender?: string;
  receiver?: string;
  content?: string;
  images?: string[];
}

export interface seenMessageModel {
  chatId?: string;
  userId?: string;
}

export interface Image {
  uri?: string;
  type?: string;
  name?: string;
}
